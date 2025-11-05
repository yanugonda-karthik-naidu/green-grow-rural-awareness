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

    const { plantId, userId } = await req.json();

    if (!plantId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing plantId or userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing automation for plant ${plantId}, user ${userId}`);

    // Get plant details
    const { data: plant, error: plantError } = await supabase
      .from('planted_trees')
      .select('*')
      .eq('id', plantId)
      .single();

    if (plantError || !plant) {
      console.error('Plant not found:', plantError);
      return new Response(
        JSON.stringify({ error: 'Plant not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate seeds to award
    let seedsAwarded = 5; // Base reward per tree
    
    // Bonus seeds for specific species
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
    const achievements = [];
    
    if (currentTreesPlanted === 1) {
      achievements.push({
        user_id: userId,
        achievement_text: 'First Tree Planted! 🌱',
        seeds_earned: 10,
      });
      
      // Also add badge
      await supabase.from('user_badges').insert({
        user_id: userId,
        badge_name: 'First Sapling',
      });
    }
    
    if (currentTreesPlanted === 10) {
      achievements.push({
        user_id: userId,
        achievement_text: 'Eco Warrior - 10 Trees Planted! ⚔️',
        seeds_earned: 25,
      });
      
      await supabase.from('user_badges').insert({
        user_id: userId,
        badge_name: 'Eco Warrior',
      });
    }
    
    if (currentTreesPlanted === 50) {
      achievements.push({
        user_id: userId,
        achievement_text: 'Forest Friend - 50 Trees! 🌳',
        seeds_earned: 50,
      });
      
      await supabase.from('user_badges').insert({
        user_id: userId,
        badge_name: 'Forest Friend',
      });
    }
    
    if (currentTreesPlanted === 100) {
      achievements.push({
        user_id: userId,
        achievement_text: 'Sustainability Leader - 100 Trees! 🌍',
        seeds_earned: 100,
      });
      
      await supabase.from('user_badges').insert({
        user_id: userId,
        badge_name: 'Sustainability Leader',
      });
    }

    // Insert achievements
    if (achievements.length > 0) {
      const { error: achievementError } = await supabase
        .from('achievements')
        .insert(achievements);
      
      if (achievementError) {
        console.error('Error inserting achievements:', achievementError);
      } else {
        console.log(`Awarded ${achievements.length} achievements`);
        
        // Update total seeds with achievement bonuses
        const totalAchievementSeeds = achievements.reduce((sum, ach) => sum + ach.seeds_earned, 0);
        await supabase
          .from('user_progress')
          .update({ 
            seed_points: currentSeeds + totalAchievementSeeds 
          })
          .eq('user_id', userId);
      }
    }

    // Create community post if public
    if (plant.is_public) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', userId)
        .single();

      const authorName = profile?.display_name || 'Green Warrior';
      
      const postContent = `🌱 ${authorName} just planted a ${plant.species || plant.tree_name}! ${plant.description ? `"${plant.description}"` : ''}`;
      
      const { error: postError } = await supabase
        .from('community_posts')
        .insert({
          user_id: userId,
          author_name: authorName,
          content: postContent,
          image_url: plant.image_path,
        });

      if (postError) {
        console.error('Error creating community post:', postError);
      } else {
        console.log('Community post created');
      }
    }

    // Update analytics counters (trigger will handle this automatically)
    const { data: analytics } = await supabase
      .from('analytics_counters')
      .select('*')
      .single();

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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});