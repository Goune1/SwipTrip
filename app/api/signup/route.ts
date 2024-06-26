import { NextResponse } from 'next/server';
//@ts-ignore
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export async function POST(request: Request): Promise<NextResponse> {
    const result = await request.json();

    const loginCollection = require("@/schemas/login");

    const DB_URL = "mongodb://goune:goune1407@ac-nef3pac-shard-00-02.0x9jwgi.mongodb.net:27017,ac-nef3pac-shard-00-01.0x9jwgi.mongodb.net:27017,ac-nef3pac-shard-00-00.0x9jwgi.mongodb.net:27017/SwipTrip?authSource=admin&replicaSet=atlas-tibrt3-shard-0&ssl=true"
    
    async function connectToDatabase() {
        try {
            await mongoose.connect(DB_URL);
            console.log("Connecté à la base de données MongoDB");
        } catch (error) {
            console.error(`Impossible de se connecter à la base de données MongoDB: ${error}`);
        }
    }

    await connectToDatabase();
  
    const data = {
        username: result.username,
        email: result.email,
        password: result.password,
        payment: 'false'
    };

    const user = await loginCollection.findOne({ email: data.email });

    if (user) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashedPassword;

    await loginCollection.insertMany(data);

    return NextResponse.json(data);
}
