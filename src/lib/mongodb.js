import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}

let client
let clientPromise

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options)
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

export default clientPromise

// Helper function to get database
export async function getDatabase() {
    const client = await clientPromise
    return client.db(process.env.MONGODB_DB_NAME || 'blog-app')
}

// Helper functions for collections
export async function getUsersCollection() {
    const db = await getDatabase()
    return db.collection('users')
}

export async function getPostsCollection() {
    const db = await getDatabase()
    return db.collection('posts')
}

export async function getCommentsCollection() {
    const db = await getDatabase()
    return db.collection('comments')
}

export async function getCategoriesCollection() {
    const db = await getDatabase()
    return db.collection('categories')
}