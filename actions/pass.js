// 'use server'

// import admin from 'firebase-admin'
// // import serviceAccount from '../utils/skey.json'
// const { getAuth } = require('firebase-admin/auth');



// const serviceAccount = {
//     type: process.env.FIREBASE_TYPE,
//     project_id: process.env.FIREBASE_PROJECT_ID || (() => {
//         console.error("Missing FIREBASE_PROJECT_ID environment variable.");
//         return ""; // Provide a fallback or empty string
//     })(),
//     private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
//     private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//     client_email: process.env.FIREBASE_CLIENT_EMAIL,
//     client_id: process.env.FIREBASE_CLIENT_ID,
//     auth_uri: process.env.FIREBASE_AUTH_URI,
//     token_uri: process.env.FIREBASE_TOKEN_URI,
//     auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
//     client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
//     universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
// };

// if (!serviceAccount.project_id) {
//     throw new Error("Service account object must contain a valid 'project_id' property.");
// }

// if (admin.apps.length === 0) {
//     admin.initializeApp({
//         credential: admin.credential.cert(serviceAccount)
//     });
// }

// /****************************** */
// export async function createNewUser(obj) {

//     return await getAuth().createUser({
//         email: obj.email,
//         emailVerified: true,
//         password: obj.password,
//         displayName: obj.displayName,
//         photoURL: 'http://www.example.com/12345678/photo.png',
//         disabled: false,
//     })
//         .then(async (userRecord) => {
//             // See the UserRecord reference doc for the contents of userRecord.

//             //Set Uidcollction
//             await getAuth()
//                 .setCustomUserClaims(userRecord.uid, {
//                     uidCollection: obj.uidCollection,
//                     title: obj.title
//                 })
//                 .then(() => {
//                     console.log('Successfully created new user:', userRecord.uid);
//                     return 'success';
//                 });
//             return 'success';
//         })
//         .catch((error) => {
//             console.log('Error creating new user:', error);
//             return error;
//         });

// }

// /****************************** */

// export const setUidCollection = async () => {

//     await getAuth()
//         .setCustomUserClaims(uid, { uidCollection: 'DQ9gNTpvXqh6K9BqMTPTgCfxD2Z2' })
//         .then(() => {
//             console.log('Successfully created uidCollection');
//         });
// }


// /*************Get Users */

// export async function getAllUsers(uidCollection) {
//     let arrs = await listAllUsers();
//     arrs = arrs.filter(x => x?.customClaims?.uidCollection === uidCollection
//         && x.uid !== "lmPDuojUfPYeZhpySVIDHupS9Io1" //isims
//         && x.uid !== "BYfS1Yf5Bac6cVhlVw68SjGVsAj2" //isgis
//         && x.uid !== "1wD74Rzav1PZ40MxXStjn9WgtJm2" //is@is.is
//     )
//     return arrs;
// }

// const listAllUsers = async (nextPageToken) => {
//     // List batch of users, 1000 at a time.

//     let arr = []
//     await getAuth()
//         .listUsers(1000, nextPageToken)
//         .then((listUsersResult) => {
//             listUsersResult.users.forEach((userRecord) => {
//                 arr.push(userRecord.toJSON())
//             });
//             if (listUsersResult.pageToken) {
//                 // List next batch of users.
//                 listAllUsers(listUsersResult.pageToken);
//             }
//         })
//         .catch((error) => {
//             console.log('Error listing users:', error);
//         });

//     return arr;
// };

// /*********************** */

// export const updateUser = async (obj) => {

//     function formatPhoneNumber(phoneNumber) {
//         // Check if the number doesn't start with a '+'
//         if (phoneNumber.charAt(0) !== '+') {
//             return '+' + phoneNumber;
//         }
//         return phoneNumber;
//     }

//     let newObj = {
//         email: obj.email,
//         phoneNumber: obj.phoneNumber && obj.phoneNumber !== '' ? formatPhoneNumber(obj.phoneNumber) : null,
//         //    emailVerified: true,
//         displayName: obj.displayName,
//         //   photoURL: 'http://www.example.com/12345678/photo.png',
//         //  disabled: false,
//     }

//     if (obj.password) {
//         newObj.password = obj.password;
//     }

//     return await getAuth()
//         .updateUser(obj.uid, newObj)
//         .then(async (userRecord) => {
//             // See the UserRecord reference doc for the contents of userRecord.
//             //Set Uidcollction
//             await getAuth()
//                 .setCustomUserClaims(userRecord.uid, {
//                     title: obj.title,
//                     uidCollection: obj.uidCollection,
//                 })
//                 .then(() => {
//                     console.log('Successfully updated user:', userRecord);
//                 });

//         })
//         .then((userRecord) => {
//             // See the UserRecord reference doc for the contents of userRecord.
//             console.log('Successfully updated user', userRecord/*.toJSON()*/);
//             return 'success';
//         })
//         .catch((error) => {
//             console.log('Error updating user:', error);
//             return { error };
//         });

// }

// /***************** */
// export const delUser = async (uid) => {
//     await getAuth()
//         .deleteUser(uid)
//         .then(() => {
//             console.log('Successfully deleted user');
//         })
//         .catch((error) => {
//             console.log('Error deleting user:', error);
//         });
// }


// ///***** */
'use server'

import admin from 'firebase-admin'
const { getAuth } = require('firebase-admin/auth');

// Log environment variables for debugging (remove in production)
console.log('Environment Check:', {
    hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
    hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
});

const serviceAccount = {
    type: process.env.FIREBASE_TYPE || "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
    token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN || "googleapis.com",
};

// Validate required fields
if (!serviceAccount.project_id) {
    console.error("❌ FIREBASE_PROJECT_ID is missing or empty in environment variables");
    throw new Error("Service account object must contain a valid 'project_id' property. Please check your .env.local file.");
}

if (!serviceAccount.private_key) {
    console.error("❌ FIREBASE_PRIVATE_KEY is missing or empty in environment variables");
    throw new Error("Service account object must contain a valid 'private_key' property.");
}

if (!serviceAccount.client_email) {
    console.error("❌ FIREBASE_CLIENT_EMAIL is missing or empty in environment variables");
    throw new Error("Service account object must contain a valid 'client_email' property.");
}

// Initialize Firebase Admin
if (admin.apps.length === 0) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('✅ Firebase Admin initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing Firebase Admin:', error);
        throw error;
    }
}

/****************************** */
export async function createNewUser(obj) {
    return await getAuth().createUser({
        email: obj.email,
        emailVerified: true,
        password: obj.password,
        displayName: obj.displayName,
        photoURL: 'http://www.example.com/12345678/photo.png',
        disabled: false,
    })
        .then(async (userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.

            //Set Uidcollction
            await getAuth()
                .setCustomUserClaims(userRecord.uid, {
                    uidCollection: obj.uidCollection,
                    title: obj.title
                })
                .then(() => {
                    console.log('Successfully created new user:', userRecord.uid);
                    return 'success';
                });
            return 'success';
        })
        .catch((error) => {
            console.log('Error creating new user:', error);
            return error;
        });
}

/****************************** */

export const setUidCollection = async (uid) => {
    await getAuth()
        .setCustomUserClaims(uid, { uidCollection: 'DQ9gNTpvXqh6K9BqMTPTgCfxD2Z2' })
        .then(() => {
            console.log('Successfully created uidCollection');
        });
}

/*************Get Users */

export async function getAllUsers(uidCollection) {
    let arrs = await listAllUsers();
    arrs = arrs.filter(x => x?.customClaims?.uidCollection === uidCollection
        && x.uid !== "lmPDuojUfPYeZhpySVIDHupS9Io1" //isims
        && x.uid !== "BYfS1Yf5Bac6cVhlVw68SjGVsAj2" //isgis
        && x.uid !== "1wD74Rzav1PZ40MxXStjn9WgtJm2" //is@is.is
    )
    return arrs;
}

const listAllUsers = async (nextPageToken) => {
    // List batch of users, 1000 at a time.
    let arr = []
    await getAuth()
        .listUsers(1000, nextPageToken)
        .then((listUsersResult) => {
            listUsersResult.users.forEach((userRecord) => {
                arr.push(userRecord.toJSON())
            });
            if (listUsersResult.pageToken) {
                // List next batch of users.
                listAllUsers(listUsersResult.pageToken);
            }
        })
        .catch((error) => {
            console.log('Error listing users:', error);
        });

    return arr;
};

/*********************** */

export const updateUser = async (obj) => {
    function formatPhoneNumber(phoneNumber) {
        // Check if the number doesn't start with a '+'
        if (phoneNumber.charAt(0) !== '+') {
            return '+' + phoneNumber;
        }
        return phoneNumber;
    }

    let newObj = {
        email: obj.email,
        phoneNumber: obj.phoneNumber && obj.phoneNumber !== '' ? formatPhoneNumber(obj.phoneNumber) : null,
        displayName: obj.displayName,
    }

    if (obj.password) {
        newObj.password = obj.password;
    }

    return await getAuth()
        .updateUser(obj.uid, newObj)
        .then(async (userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
            //Set Uidcollction
            await getAuth()
                .setCustomUserClaims(userRecord.uid, {
                    title: obj.title,
                    uidCollection: obj.uidCollection,
                })
                .then(() => {
                    console.log('Successfully updated user:', userRecord);
                });
        })
        .then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log('Successfully updated user', userRecord);
            return 'success';
        })
        .catch((error) => {
            console.log('Error updating user:', error);
            return { error };
        });
}

/***************** */
export const delUser = async (uid) => {
    await getAuth()
        .deleteUser(uid)
        .then(() => {
            console.log('Successfully deleted user');
        })
        .catch((error) => {
            console.log('Error deleting user:', error);
        });
}