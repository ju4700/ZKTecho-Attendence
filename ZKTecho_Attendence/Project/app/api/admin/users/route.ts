import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { zktecoService } from '@/lib/zkteco';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const users = await User.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const userData = await request.json();
    
    // Validate required fields
    const { uniqueId, name, monthlySalary, monthlyOffDays } = userData;
    
    if (!uniqueId || !name || !monthlySalary || monthlyOffDays === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if uniqueId already exists
    const existingUser = await User.findOne({ uniqueId });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this ID already exists' },
        { status: 409 }
      );
    }

    // Create user in database
    const user = new User(userData);
    await user.save();

    // Enroll user on biometric device if requested
    if (userData.enrollBiometric) {
      try {
        const connected = await zktecoService.connect();
        if (connected) {
          const enrolled = await zktecoService.enrollUser(uniqueId, name);
          if (enrolled) {
            user.biometricEnrolled = true;
            await user.save();
          }
          await zktecoService.disconnect();
        }
      } catch (error) {
        console.error('Biometric enrollment error:', error);
        // Don't fail the user creation if biometric enrollment fails
      }
    }

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}