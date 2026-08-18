import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            require: true
        },
        author: {
            type: String,
            require: true
        },
        category: {
            type: String,
            require: true
        },
        readTime: {
            type: String,
        },
        image: {
            type: String,
        },
        excerpt: {
            type: String,
            require: true
        },
        content: {
            type: String,
            require: true
        },
        tags: [{type: String}],
        seo: {
            metaTitle: {type: String},
            focusKeyword: {type: String},
            metaDescription: {type: String},
            slug: {type: String},
            canonical: {type: String},
        },
        createdAt: {type: Date, default: Date.now}
    }
);

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);