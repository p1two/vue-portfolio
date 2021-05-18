<template>
  <div>
    <header id="site_header" class="container d_flex">
      <div class="bio__media">
        <img src="@/assets/img/avatar.png" alt="">
        <div class="bio__media__text">
          <h1>Mozart Pistori Tomazetti</h1>
          <h3>Python Enthusiast</h3>
        </div>
      </div>
      <nav>
        <router-link to='/'>Home</router-link>
      </nav>
    </header>
    <main class="container">
      <div class="error" v-if="error">
        <h3>{{ error.title }}</h3>
        <p>{{ error.message }} 😥</p>
      </div>
      <div class="loading" v-else-if="loading"> 😴  Loading ... </div>
      <section id="portfolio" v-else>
        <div class="cards">
          <div v-for="project in projectsList" :key="project.id" class="card__custom">
            <div class="card__custom__text">
            <div>
              <h3>{{trimTitle(project.name)}}</h3>
              <p>{{trimText(project.description)}}</p>
            </div>
            <div class="meta__data d_flex">
              <div class="date">
                <h5>Updated at</h5>
                <div>{{new Date(project.updated_at).toDateString()}}</div>
              </div>
              <img class="avatar" :src="project.owner.avatar_url">
            </div>
            </div>
              <div class="card__custom__img"></div>
              <div class="card_custom__button">
              <a :href="project.html_url" target="_blank">
                Code
              </a>
            </div>
          </div>
        </div>
        <div style="text-align: center; width:100%">
          <div v-if="projectsList.length < projects.length">
            <button class="btn_load_more" v-on:click="loadMore()">Load More</button>
          </div>
          <div v-else>
            <a href="https://github.com/P1tch0o" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-github fa-lg fa-fw"></i>
            </a>
          </div>
        </div>
        <div id="skills_section">
          <h2>Development Skills</h2>
          <ul class="skills">
            <li v-for="(skill, index) in skills" :key="index">{{skill}}</li>
          </ul>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import axios from 'axios'

interface Error  {
  title: string,
  message: string
}

@Options({
  mounted() {
    this.fetchData()
  }
})
export default class Projects extends Vue {
  projects = []
  projectsList = []
  skills: Array<string> = []
  projectsCount = 6
  perPage = 20
  page = 1
  loading = true
  error:Error|null = null
  async fetchData(): Promise<void> {
    try {
      this.error = null
      this.loading = true
      const url = 'https://api.github.com/users/P1tch0o/repos?per_page=${this.perPage}&page=${this.page}'
      const response = await axios.get(url)
      this.projects = response.data
      this.projects.forEach((project: { language: string }) => {
        if (project.language !== null && ! this.skills.includes(project.language)) {
          this.skills.push(project.language)
        }
      })
    } catch (err) {
      if (err.response) {
        // client received an error response (5xx, 4xx)
        this.error = {
          title: "Server Response",
          message: err.message
        }
      } else if (err.request) {
        // client never received a response, or request never left
        this.error = {
          title: "Unable to Reach Server",
          message: err.message
        }
      } else {
        // There's probably an error in your code
        this.error = {
          title: "Application Error",
          message: err.message
        }
      }
    }
    this.loading = false
    this.getProjects()
  }
  getProjects(): Array<unknown> {
    this.projectsList = this.projects.slice(0, this.projectsCount);
    return this.projectsList;
  }
  loadMore(): void {
    if(this.projectsList.length <= this.projects.length){
      this.projectsCount += 5;
      this.projectsList = this.projects.slice(0, this.projectsCount)
    }
  }
  trimTitle(text: string): string {
    let title = text.replaceAll("-", " ").replace("_", " ")
    if(title.length > 15) {
      return title.slice(0, 15) + ' ...'
    } return title;

  }
  trimText(text: string): string {
    if(text.length > 100) {
      return text.slice(0, 100) + ' ...'
    } return text;
  }
  }
</script>

<style src="@/assets/css/projects.min.css"></style>
