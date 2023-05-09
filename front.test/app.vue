<script setup>

class ArticleModel {
    constructor() {
        this.API_URI = 'http://back.test'
    }
    async get() {
        const { data } = await useAsyncData(() => $fetch(`${this.API_URI}/articles`))
        return data
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
}

class ArticleController {
    constructor() {
        this.articleModel = new ArticleModel()
        this.aritcleView = new AritcleView()
    }
    async get() {
        return this.articleModel.get()
    }
    async add() {
        const postData = {
            title: title.value,
            content: content.value,
        }
        await this.articleModel.add(postData)
        await this.get()
        this.reset()
    }
    async edit() {
        const postData = {
            title: title.value,
            content: content.value,
        }
        await this.articleModel.edit(id.value, postData)
        await this.get()
        this.reset()
    }
    async delete() {
        await this.articleModel.delete(id.value)
        await this.get()
        this.reset()
    }
    onClick(index) {
        editMode.value = false
        const article = articles.value[index]
        title.value = article.title
        content.value = article.content
        id.value = article.id
    }
    reset() {
        this.aritcleView.reset()
    }
}
const articleController = new ArticleController()
const articles = await articleController.get()

let title = ref('')
let content = ref('')
let id = ref('')
let editMode = ref(true)

</script>

<template>
    <div>
        <header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
            <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">Company name</a>
            <button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <input class="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search">
            <div class="navbar-nav">
                <div class="nav-item text-nowrap">
                    <a class="nav-link px-3" href="#">Sign out</a>
                </div>
            </div>
        </header>
        <div class="container-fluid">
            <div class="row">
                <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
                    <div class="position-sticky pt-3">
                        <ul class="nav flex-column">
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="#">
                                    <span data-feather="home"></span>
                                    Dashboard
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">
                                    <span data-feather="file"></span>
                                    Orders
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">
                                    <span data-feather="shopping-cart"></span>
                                    Products
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">
                                    <span data-feather="users"></span>
                                    Customers
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">
                                    <span data-feather="bar-chart-2"></span>
                                    Reports
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">
                                    <span data-feather="layers"></span>
                                    Integrations
                                </a>
                            </li>
                        </ul>

                        <h6
                            class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                            <span>Saved reports</span>
                            <a class="link-secondary" href="#" aria-label="Add a new report">
                                <span data-feather="plus-circle"></span>
                            </a>
                        </h6>
                        <ul class="nav flex-column mb-2">
                            <li class="nav-item">
                                <a class="nav-link" href="#">
                                    <span data-feather="file-text"></span>
                                    Current month
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">
                                    <span data-feather="file-text"></span>
                                    Last quarter
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">
                                    <span data-feather="file-text"></span>
                                    Social engagement
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">
                                    <span data-feather="file-text"></span>
                                    Year-end sale
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>

                <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
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
                                <tr v-for="(article, index) in articles" :key="article.id"
                                    @click="articleController.onClick(index)">
                                    <td>{{ article.id }}</td>
                                    <td>{{ article.title }}</td>
                                    <td>{{ article.content }}</td>
                                    <td>{{ article.userId }}</td>
                                    <td>{{ article.createdAt }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>

    </div>
</template>


<style scoped>
body {
    font-size: .875rem;
}

.feather {
    width: 16px;
    height: 16px;
    vertical-align: text-bottom;
}

/*
 * Sidebar
 */

.sidebar {
    position: fixed;
    top: 0;
    /* rtl:raw:
  right: 0;
  */
    bottom: 0;
    /* rtl:remove */
    left: 0;
    z-index: 100;
    /* Behind the navbar */
    padding: 48px 0 0;
    /* Height of navbar */
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}

@media (max-width: 767.98px) {
    .sidebar {
        top: 5rem;
    }
}

.sidebar-sticky {
    position: relative;
    top: 0;
    height: calc(100vh - 48px);
    padding-top: .5rem;
    overflow-x: hidden;
    overflow-y: auto;
    /* Scrollable contents if viewport is shorter than content. */
}

.sidebar .nav-link {
    font-weight: 500;
    color: #333;
}

.sidebar .nav-link .feather {
    margin-right: 4px;
    color: #727272;
}

.sidebar .nav-link.active {
    color: #2470dc;
}

.sidebar .nav-link:hover .feather,
.sidebar .nav-link.active .feather {
    color: inherit;
}

.sidebar-heading {
    font-size: .75rem;
    text-transform: uppercase;
}

/*
 * Navbar
 */

.navbar-brand {
    padding-top: .75rem;
    padding-bottom: .75rem;
    font-size: 1rem;
    background-color: rgba(0, 0, 0, .25);
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, .25);
}

.navbar .navbar-toggler {
    top: .25rem;
    right: 1rem;
}

.navbar .form-control {
    padding: .75rem 1rem;
    border-width: 0;
    border-radius: 0;
}

.form-control-dark {
    color: #fff;
    background-color: rgba(255, 255, 255, .1);
    border-color: rgba(255, 255, 255, .1);
}

.form-control-dark:focus {
    border-color: transparent;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, .25);
}

.bd-placeholder-img {
    font-size: 1.125rem;
    text-anchor: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
}

@media (min-width: 768px) {
    .bd-placeholder-img-lg {
        font-size: 3.5rem;
    }
}
</style>
<style scoped>
.articleList tbody td {
    cursor: pointer;
}

.mar3 {
    margin-right: 3px;
}
</style>