import { NextResponse } from 'next/server';
import type { LandingPageConfig } from '@/types/site';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const landingPage = json.landingPage as LandingPageConfig;

    if (!landingPage) {
      return NextResponse.json(
        { success: false, message: 'Missing landingPage payload' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Fetch existing site_config to merge
        const { data: existing } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'site_config')
          .single();

        const currentVal =
          existing?.value && typeof existing.value === 'object'
            ? (existing.value as Record<string, unknown>)
            : {};

        const updatedVal = {
          ...currentVal,
          landingPage,
        };

        const { error } = await supabase.from('site_settings').upsert({
          key: 'site_config',
          value: updatedVal,
        });

        if (error) {
          console.error('[CARRYFORM Admin] Supabase site_settings upsert error:', error);
          return NextResponse.json(
            { success: false, mode: 'error', error: error.message },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          mode: 'supabase',
          message: 'Saved to Supabase database successfully',
        });
      } catch (dbErr) {
        console.error('[CARRYFORM Admin] Supabase connection error:', dbErr);
        return NextResponse.json(
          { success: false, mode: 'error', error: String(dbErr) },
          { status: 500 }
        );
      }
    }

    // Supabase not configured — operating in zero-config local mode
    return NextResponse.json({
      success: true,
      mode: 'local',
      message: 'Saved locally in browser repository',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
