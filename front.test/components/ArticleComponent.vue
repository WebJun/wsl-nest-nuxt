<script lang="ts" setup>
import axios, { AxiosResponse } from 'axios'

interface Article {
    id: number
    title: string
    content: string
    createdAt: string
    userId: number
}

interface ArticlePostData {
    title: string
    content: string
    userId: number
}

class ArticleModel {
    private readonly API_URI = 'http://back.test'

    async get(): Promise<Article[]> {
        const { data }: AxiosResponse<Article[]> = await axios.get(`${this.API_URI}/articles`)
        return data
    }

    async add(postData: ArticlePostData): Promise<void> {
        await axios.post(`${this.API_URI}/articles`, postData)
    }

    async edit(id: number, postData: ArticlePostData): Promise<void> {
        await axios.put(`${this.API_URI}/articles/${id}`, postData)
    }

    async delete(id: number): Promise<void> {
        await axios.delete(`${this.API_URI}/articles/${id}`)
    }
}

class ArticleView {
    resetFields() {
        editMode.value = true;
        title.value = '';
        content.value = '';
    }

    getDatetime(str?: string) {
        const d = str ? new Date(str) : new Date();
        const year = d.getFullYear().toString().padStart(4, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        const hour = d.getHours().toString().padStart(2, '0');
        const minute = d.getMinutes().toString().padStart(2, '0');
        const second = d.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
}

class ArticleController {
    private readonly articleModel: ArticleModel
    private readonly articleView: ArticleView

    constructor() {
        this.articleModel = new ArticleModel()
        this.articleView = new ArticleView()
    }

    public async getArticles(): Promise<Article[]> {
        let articles = await this.articleModel.get()
        articles = articles.map(article => {
            article.createdAt = this.articleView.getDatetime(article.createdAt)
            return article
        })
        return articles
    }

    public async addArticle(): Promise<void> {
        const postData: ArticlePostData = {
            title: title.value ?? '',
            content: content.value ?? '',
            userId: 2,
        };
        await this.articleModel.add(postData)
        articles.value = await this.getArticles()
        this.articleView.resetFields()
    }

    public async editArticle(): Promise<void> {
        const postData = {
            title: title.value ?? '',
            content: content.value ?? '',
            userId: 2,
        }
        await this.articleModel.edit(id.value as number, postData)
        articles.value = await this.getArticles()
        this.articleView.resetFields()
    }

    public async deleteArticle(): Promise<void> {
        await this.articleModel.delete(id.value as number)
        articles.value = await this.getArticles()
        this.articleView.resetFields()
    }

    public clickArticle(article: Article): void {
        editMode.value = false
        title.value = article.title
        content.value = article.content
        id.value = article.id
    }
}

const title: Ref<string> = ref('')
const content: Ref<string> = ref('')
const id: Ref<number> = ref(0)
const articles: Ref<Article[]> = ref([])
const editMode: Ref<boolean> = ref(true)
const articleController = new ArticleController()
const articleView = new ArticleView()

async function init() {
    articles.value = await articleController.getArticles()
}

init()
</script>


<template>
    <div>
        <div
            class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Dashboard</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
                <div class="btn-group me-2">
                    <button type="button" class="btn btn-sm btn-outline-secondary">Share</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
                </div>
                <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
                    <span data-feather="calendar"></span>
                    This week
                </button>
            </div>
        </div>

        <div>
            <div class="form-floating mb-3">
                <input type="email" class="form-control title" placeholder="title" v-model="title">
                <label class="labelPlaceholder">title</label>
            </div>
            <div class="form-floating">
                <textarea class="form-control content" placeholder="content" v-model="content"
                    style="height: 100px"></textarea>
                <label class="labelPlaceholder">content</label>
            </div>
            <div style="margin-top:3px;">
                <button type="button" class="btn btn-sm btn-success mar3" @click="articleView.resetFields"
                    v-if="!editMode">Cancel</button>
                <button type="button" class="btn btn-sm btn-primary mar3" @click="articleController.addArticle"
                    v-if="editMode">Add</button>
                <button type="button" class="btn btn-sm btn-primary mar3" @click="articleController.editArticle"
                    v-if="!editMode">Edit</button>
                <button type="button" class="btn btn-sm btn-danger mar3" @click="articleController.deleteArticle"
                    v-if="!editMode">Delete</button>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-striped table-sm articleList">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">title</th>
                        <th scope="col">content</th>
                        <th scope="col">userId</th>
                        <th scope="col">createdAt</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(article, index) in articles" :key="article.id" @click="articleController.clickArticle(article)">
                        <td>{{ article.id }}</td>
                        <td>{{ article.title }}</td>
                        <td>{{ article.content }}</td>
                        <td>{{ article.userId }}</td>
                        <td>{{ article.createdAt }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
.articleList tbody td {
    cursor: pointer;
}

.mar3 {
    margin-right: 3px;
}

.labelPlaceholder {
    color: #aaa
}
</style>