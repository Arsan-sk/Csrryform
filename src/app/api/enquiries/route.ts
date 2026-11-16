import { NextResponse } from 'next/server';
import { EnquirySchema, type ValidatedEnquiry } from '@/lib/validation/enquiry';

export async function POST(request: Request) {
  try {
    const json = await request.json() as ValidatedEnquiry;

    // Validate with Zod
    const result = EnquirySchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid input. Please ensure you provide either a phone number or email.',
          errors: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { name, phone, email, productSlug, message, consent, website } = result.data;

    // Honeypot check: silently succeed or reject bots
    if (website && website.length > 0) {
      return NextResponse.json({ success: true, message: 'Enquiry received.' });
    }

    // Try storing in Supabase if configured, otherwise log on server
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { error } = await supabase.from('contact_messages').insert([
          {
            name,
            phone: phone || null,
            email: email || null,
            product_slug: productSlug || null,
            message,
            consent,
          },
        ]);

        if (error) {
          console.error('[CARRYFORM Enquiries] Supabase insert failed:', error);
          // Fall through to server log
        }
      } catch (dbErr) {
        console.error('[CARRYFORM Enquiries] DB error:', dbErr);
      }
    } else {
      console.log('[CARRYFORM Enquiries] Local enquiry log:', {
        name,
        phone,
        email,
        productSlug,
        message,
        receivedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Your enquiry has been received. We will contact you soon.',
    });
  } catch (err) {
    console.error('[CARRYFORM Enquiries] Route error:', err);
    return NextResponse.json(
      { success: false, message: 'Server error processing enquiry.' },
      { status: 500 }
    );
  }
}

