<script setup >

class ArticleModel {
    constructor() {
        this.API_URI = 'http://back.test'
    }
    async get() {
        const { data } = await useAsyncData(() => $fetch(`${this.API_URI}/articles`))
        return data._rawValue
    }
    async add(postData) {
        await useAsyncData(() => $fetch(`${this.API_URI}/articles`, {
            method: 'post',
            body: postData
        }))
    }
    async edit(id, postData) {
        await useAsyncData(() => $fetch(`${this.API_URI}/articles/${id}`, {
            method: 'put',
            body: postData
        }))
    }
    async delete(id) {
        await useAsyncData(() => $fetch(`${this.API_URI}/articles/${id}`, {
            method: 'delete',
        }))
    }
}

class AritcleView {
    reset() {
        editMode.value = true
        title.value = '';
        content.value = '';
    }
    getDatetime(str) {
        let d = new Date();
        if (typeof str !== 'undefined') {
            d = new Date(str);
        }
        let s =
            String(d.getFullYear()).padStart(4, '0') +
            '-' +
            String(d.getMonth() + 1).padStart(2, '0') +
            '-' +
            String(d.getDate()).padStart(2, '0') +
            ' ' +
            String(d.getHours()).padStart(2, '0') +
            ':' +
            String(d.getMinutes()).padStart(2, '0') +
            ':' +
            String(d.getSeconds()).padStart(2, '0');
        return s;
    }
}

class ArticleController {
    constructor() {
        this.articleModel = new ArticleModel()
        this.aritcleView = new AritcleView()
    }
    async get() {
        let articles = await this.articleModel.get()
        articles = articles.map((article) => {
            article.createdAt = this.aritcleView.getDatetime(article.createdAt)
            return article
        })
        return articles
    }
    async add() {
        const postData = {
            title: title.value,
            content: content.value,
            userId: 1,
        }
        await this.articleModel.add(postData)
        articles.value = await this.get()
        this.reset()
    }
    async edit() {
        const postData = {
            title: title.value,
            content: content.value,
        }
        await this.articleModel.edit(id.value, postData)
        articles.value = await this.get()
        this.reset()
    }
    async delete() {
        await this.articleModel.delete(id.value)
        articles.value = await this.get()
        this.reset()
    }
    onClick(article) {
        editMode.value = false
        title.value = article.title
        content.value = article.content
        id.value = article.id
    }
    reset() {
        this.aritcleView.reset()
    }
}

let title = ref()
let content = ref()
let id = ref()
let articles = ref()
let editMode = ref(true)

const articleController = new ArticleController()
articles.value = await articleController.get()

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
                <label>title</label>
            </div>
            <div class="form-floating">
                <textarea class="form-control content" placeholder="content" v-model="content"
                    style="height: 100px"></textarea>
                <label>content</label>
            </div>
            <div style="margin-top:3px;">
                <button type="button" class="btn btn-sm btn-success mar3" @click="articleController.reset"
                    v-if="!editMode">Cancel</button>
                <button type="button" class="btn btn-sm btn-primary mar3" @click="articleController.add"
                    v-if="editMode">Add</button>
                <button type="button" class="btn btn-sm btn-primary mar3" @click="articleController.edit"
                    v-if="!editMode">Edit</button>
                <button type="button" class="btn btn-sm btn-danger mar3" @click="articleController.delete"
                    v-if="!editMode">Delete</button>
            </div>
        </div>

        <h2>Section title</h2>
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
                    <tr v-for="(article, index) in articles" :key="article.id" @click="articleController.onClick(article)">
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
</style>