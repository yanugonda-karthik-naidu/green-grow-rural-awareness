import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // SECURE: Extract userId from authenticated session
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = user.id;
    const { plantId } = await req.json();

    if (!plantId) {
      return new Response(
        JSON.stringify({ error: 'Missing plantId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing automation for plant ${plantId}, user ${userId}`);

    // Get plant details and verify ownership
    const { data: plant, error: plantError } = await supabase
      .from('planted_trees')
      .select('*')
      .eq('id', plantId)
      .eq('user_id', userId)
      .single();

    if (plantError || !plant) {
      console.error('Plant not found or access denied:', plantError);
      return new Response(
        JSON.stringify({ error: 'Plant not found or access denied' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate seeds to award
    let seedsAwarded = 5;
    const bonusSpecies = ['neem', 'peepal', 'banyan'];
    if (plant.species && bonusSpecies.includes(plant.species.toLowerCase())) {
      seedsAwarded += 2;
      console.log(`Bonus seeds for ${plant.species}: +2`);
    }

    // Get current user progress
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    const currentTreesPlanted = (progress?.trees_planted || 0) + 1;
    const currentSeeds = (progress?.seed_points || 0) + seedsAwarded;

    // Update user progress
    const { error: updateError } = await supabase
      .from('user_progress')
      .update({
        trees_planted: currentTreesPlanted,
        seed_points: currentSeeds,
        co2_reduced: (progress?.co2_reduced || 0) + plant.impact_co2_kg,
        oxygen_generated: (progress?.oxygen_generated || 0) + (plant.impact_o2_l_per_day * 365),
        green_area_expanded: (progress?.green_area_expanded || 0) + plant.area_m2,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating user progress:', updateError);
    } else {
      console.log(`User progress updated: ${currentTreesPlanted} trees, ${currentSeeds} seeds`);
    }

    // Award achievements based on milestones
    const achievements: { user_id: string; achievement_text: string; seeds_earned: number }[] = [];

    if (currentTreesPlanted === 1) {
      achievements.push({ user_id: userId, achievement_text: 'First Tree Planted! 🌱', seeds_earned: 10 });
      await supabase.from('user_badges').insert({ user_id: userId, badge_name: 'First Sapling' });
    }
    if (currentTreesPlanted === 10) {
      achievements.push({ user_id: userId, achievement_text: 'Eco Warrior - 10 Trees Planted! ⚔️', seeds_earned: 25 });
      await supabase.from('user_badges').insert({ user_id: userId, badge_name: 'Eco Warrior' });
    }
    if (currentTreesPlanted === 50) {
      achievements.push({ user_id: userId, achievement_text: 'Forest Friend - 50 Trees! 🌳', seeds_earned: 50 });
      await supabase.from('user_badges').insert({ user_id: userId, badge_name: 'Forest Friend' });
    }
    if (currentTreesPlanted === 100) {
      achievements.push({ user_id: userId, achievement_text: 'Sustainability Leader - 100 Trees! 🌍', seeds_earned: 100 });
      await supabase.from('user_badges').insert({ user_id: userId, badge_name: 'Sustainability Leader' });
    }

    if (achievements.length > 0) {
      const { error: achievementError } = await supabase.from('achievements').insert(achievements);
      if (achievementError) {
        console.error('Error inserting achievements:', achievementError);
      } else {
        console.log(`Awarded ${achievements.length} achievements`);
        const totalAchievementSeeds = achievements.reduce((sum, ach) => sum + ach.seeds_earned, 0);
        await supabase.from('user_progress').update({ seed_points: currentSeeds + totalAchievementSeeds }).eq('user_id', userId);
      }
    }

    // Create community post if public
    if (plant.is_public) {
      const { data: profile } = await supabase.from('profiles').select('display_name').eq('id', userId).single();
      const authorName = profile?.display_name || 'Green Warrior';
      const postContent = `🌱 ${authorName} just planted a ${plant.species || plant.tree_name}! ${plant.description ? `"${plant.description}"` : ''}`;
      await supabase.from('community_posts').insert({
        user_id: userId,
        author_name: authorName,
        content: postContent,
        image_url: plant.image_path,
      });
    }

    const { data: analytics } = await supabase.from('analytics_counters').select('*').single();

    return new Response(
      JSON.stringify({
        success: true,
        seedsAwarded: seedsAwarded + (achievements.length > 0 ? achievements.reduce((sum, ach) => sum + ach.seeds_earned, 0) : 0),
        achievements: achievements.map(a => a.achievement_text),
        totalTrees: currentTreesPlanted,
        analytics,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in plant-automation function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
