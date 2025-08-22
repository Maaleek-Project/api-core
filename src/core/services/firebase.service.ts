import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { google } from 'googleapis';

@Injectable()
export class FirebaseService implements OnModuleInit {

  private database: admin.firestore.Firestore;
  private readonly MESSAGING_SCOPE: string = process.env.MESSAGING_SCOPE as string;

  constructor() {}

  onModuleInit() {
    if (!admin.apps.length)
    {
        admin.initializeApp({
        credential: admin.credential.cert(
            {
                projectId : process.env.FIREBASE_PROJECT_ID,
                clientEmail : process.env.FIREBASE_CLIENT_EMAIL,
                privateKey : process.env.FIREBASE_PRIVATE_KEY
            }
        ),
        });
    }
    
    this.database = admin.firestore();
  }

   

    async getAccessToken(): Promise<string | null> {
        const auth = new google.auth.JWT({
            email: process.env.FIREBASE_CLIENT_EMAIL,
            key: process.env.FIREBASE_PRIVATE_KEY,
            scopes: [this.MESSAGING_SCOPE],
        })
        return new Promise((resolve, reject) => {
            auth.authorize(function (err, tokens) {
                if(tokens)
                {
                  resolve(tokens.access_token!);
                }
                reject(err);
            })
        })
    }

    async toPush(deviceToken: string, title: string, body: string): Promise<any> {
        const accessToken = await this.getAccessToken();
        if (accessToken) {
            const payload = {
                message: {
                    token: deviceToken,
                    notification: {
                        title: title,
                        body: body
                    }
                }
            }
            const response = await fetch(process.env.PUSH_NOTIFICATION_URL!, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload)
            });
            return response.json();
        }
    }

    async toSave(collection : string, data : any) : Promise<any> {
        return await this.database.collection(collection).add(data).then(function(docRef) {
            return docRef;
        }).catch(function(error) {
            return error;
        });
    }

}