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
        email: result.email,
        password: result.password
    };

    const user = await loginCollection.findOne({ email: data.email });

    const isMatch = await bcrypt.compare(data.password, user.password);

    if(!isMatch) {
        return NextResponse.json({error: 'Mot de passe incorrect'}, {status: 400});
    }

    let dataSent = {
        username: user.username,
        email: data.email,
        payment: 'false'
    }

    if(user.payment === "true") {
        dataSent = {
            username: user.username,
            email: data.email,
            payment: 'true'
        }
    }

    return NextResponse.json(dataSent);
}
