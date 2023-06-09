<script lang="ts" setup>
import axios, { AxiosResponse } from 'axios'

interface Article {
    id: number
    title: string
    content: string
    createdAt: string
    userId: number
    images: any
}

interface ArticlePostData {
    title: string
    content: string
    userId: number
    images: any
}

interface Pagination {
    totalCount: number
    pageCount: number
    currentPage: number
    start: number
    end: number
    previous: number
    next: number
}

interface fetchData {
    items: Array<Article>
    pagination: Pagination
}

class Util {
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
    range(start: number, end: number): number[] {
        const res: number[] = [];
        for (let i = start; i <= end; i++) {
            res.push(i);
        }
        return res;
    }
}

class ArticleModel {
    private readonly API_URI = 'http://back.test'

    async fetch(page: number): Promise<fetchData> {
        const { data }: AxiosResponse<fetchData> = await axios.get(`${this.API_URI}/articles?page=${page}&limit=10&sort=id`)
        return data
    }

    async add(postData: any): Promise<void> {
        await axios.post(`${this.API_URI}/articles`, postData)
    }

    async edit(id: number, postData: ArticlePostData): Promise<void> {
        await axios.put(`${this.API_URI}/articles/${id}`, postData)
    }

    async delete(id: number): Promise<void> {
        await axios.delete(`${this.API_URI}/articles/${id}`)
    }
}

class ArticleController {
    private readonly util: Util
    private readonly articleModel: ArticleModel
    private fileInput!: HTMLInputElement

    constructor() {
        this.articleModel = new ArticleModel()
        this.util = new Util()
    }

    public async init(): Promise<void> {
        page.value = Number(route.query.page ?? 1)
        await this.getArticles()
    }

    private async getArticles(): Promise<void> {
        let data = await this.articleModel.fetch(page.value ?? 1)
        pagination.value = data.pagination

        articles.value = data.items.map(article => {
            article.createdAt = this.util.getDatetime(article.createdAt)
            return article
        })
        router.push(`?page=${page.value}`);
    }

    public async addArticle(): Promise<void> {
        const postData = new FormData();
        for (let i = 0; i < fileData.value.length; i++) {
            postData.append('images[]', fileData.value[i]);
        }
        postData.append('title', title.value ?? '',);
        postData.append('content', content.value ?? '');
        postData.append('userId', '1');

        await this.articleModel.add(postData)
        await this.getArticles()
        this.resetFields()
    }

    public async editArticle(): Promise<void> {
        const postData = {
            title: title.value ?? '',
            content: content.value ?? '',
            userId: 1,
            images: [],
        }
        await this.articleModel.edit(id.value as number, postData)
        await this.getArticles()
        this.resetFields()
    }

    public async deleteArticle(): Promise<void> {
        await this.articleModel.delete(id.value as number)
        await this.getArticles()
        this.resetFields()
    }

    public clickArticle(article: Article): void {
        editMode.value = false
        title.value = article.title
        content.value = article.content
        id.value = article.id
    }

    public async movePage(p: number) {
        page.value = p
        await this.getArticles()
    }

    public resetFields() {
        editMode.value = true;
        title.value = '';
        content.value = '';
        fileData.value = '';
        if (this.fileInput !== undefined) {
            this.fileInput.value = "";
        }        
    }

    public changeFile(event: any) {
        this.fileInput = event.target
        fileData.value = event.target.files;
    }
}

let title: Ref<string> = ref('')
let content: Ref<string> = ref('')
let fileData: Ref<any> = ref('')
let id: Ref<number> = ref(0)
let editMode: Ref<boolean> = ref(true)
let articles: Ref<Article[]> = ref([])
let page: Ref<number> = ref(1)
let pagination: Ref<Pagination> = ref({
    totalCount: 1,
    pageCount: 1,
    currentPage: 1,
    start: 1,
    end: 1,
    previous: 1,
    next: 1,
})

const router = useRouter();
const route = useRoute()
const articleController = new ArticleController()
const util = new Util()

articleController.init()

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
                <input type="text" class="form-control title" placeholder="title" v-model="title">
                <label class="labelPlaceholder">title</label>
            </div>
            <div class="form-floating">
                <textarea class="form-control content" placeholder="content" v-model="content"
                    style="height: 100px"></textarea>
                <label class="labelPlaceholder">content</label>
            </div>
            <div class="input-group mb-3" style="margin-top:5px;">
                <input type="file" class="form-control" id="abc" @change="articleController.changeFile" multiple>
                <label class="input-group-text" for="abc">Upload</label>
            </div>
            <div style="margin-top:3px;">
                <button type="button" class="btn btn-sm btn-success marginRight3" @click="articleController.resetFields"
                    v-if="!editMode">Cancel</button>
                <button type="button" class="btn btn-sm btn-primary marginRight3" @click="articleController.addArticle"
                    v-if="editMode">Add</button>
                <button type="button" class="btn btn-sm btn-primary marginRight3" @click="articleController.editArticle"
                    v-if="!editMode">Edit</button>
                <button type="button" class="btn btn-sm btn-danger marginRight3" @click="articleController.deleteArticle"
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
                        <th scope="col">images</th>
                        <th scope="col">userId</th>
                        <th scope="col">createdAt</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(article, index) in articles" :key="article.id"
                        @click="articleController.clickArticle(article)">
                        <td>{{ article.id }}</td>
                        <td>{{ article.title }}</td>
                        <td>{{ article.content }}</td>
                        <td>
                            <img v-for="img in article.images" :src="img" style="width:100px;" />
                        </td>
                        <td>{{ article.userId }}</td>
                        <td>{{ article.createdAt }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="flexCenter" v-if="pagination">
            <ul class="pagination pagination-sm">
                <li :class="['page-item', { 'disabled': pagination.start <= 1 }]"
                    @click="articleController.movePage(pagination.previous)">
                    <a class="page-link">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li :class="['page-item']" @click="articleController.movePage(1)" v-if="pagination.start > 1">
                    <a class="page-link">
                        1
                    </a>
                </li>
                <li :class="['page-item']" @click="articleController.movePage(1)" v-if="pagination.start > 1">
                    <a class="page-link">
                        ...
                    </a>
                </li>
                <li class="page-item" v-for="p in util.range(pagination.start, pagination.end)"
                    @click="articleController.movePage(p)">
                    <a :key="p" :class="['page-link', { 'active': p === pagination.currentPage }]">{{ p }}</a>
                </li>
                <li :class="['page-item']" @click="articleController.movePage(pagination.pageCount)"
                    v-if="pagination.end < pagination.pageCount">
                    <a class="page-link">
                        ...
                    </a>
                </li>
                <li :class="['page-item']" @click="articleController.movePage(pagination.pageCount)"
                    v-if="pagination.end < pagination.pageCount">
                    <a class="page-link">
                        {{ pagination.pageCount }}
                    </a>
                </li>
                <li :class="['page-item', { 'disabled': pagination.end >= pagination.pageCount }]"
                    @click="articleController.movePage(pagination.next)">
                    <a class="page-link">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.articleList tbody td {
    cursor: pointer;
}

.marginRight3 {
    margin-right: 3px;
}

.labelPlaceholder {
    color: #aaa
}

.flexCenter {
    display: flex;
    justify-content: center
}
</style>