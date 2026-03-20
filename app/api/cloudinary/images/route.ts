import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || !process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET) {
      return NextResponse.json({ error: 'Cloudinary API credentials not configured' }, { status: 500 });
    }

    const result = await cloudinary.search
      .expression('folder:needieshop')
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute();

    return NextResponse.json({ resources: result.resources });
  } catch (error) {
    console.error('Error fetching images from Cloudinary:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}
