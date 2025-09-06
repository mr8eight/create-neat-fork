<template>
  <div class="container">
    <header class="header">
      <h1 class="title">create-neat</h1>
      <div class="description">
        🚀🚀🚀 Developed a front-end scaffold based on PNPM and Turborepo, aimed at quickly
        creating various types of projects for users.
      </div>
      <div class="button_wrapper">
        <a class="button_blue" href="https://test-docs-tesrt.vercel.app/guide/what-is-create-neat.html">
          开始
        </a>
        <a class="button_white" href="https://github.com/xun082/create-neat">
          Github
        </a>
      </div>
    </header>

    <main class="main">
      <div class="box_container">
        <div class="box" v-for="(item, index) in boxes" :key="index">
          <div class="box_emoji">{{ item.emoji }}</div>
          <div class="box_text">{{ item.text }}</div>
        </div>
      </div>
    </main>
    <footer class="footer">
      <div class="footer_text">Released under the MIT License.</div>
      <div class="footer_text">Copyright © 2023-present Moment</div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      boxes: [
        { emoji: '📦', text: '零配置,开箱即用;' },
        {
          emoji: '🚀',
          text:
            '使用 axios + npm 的方式构建你的项目基础模板，初始化速度要比 create-react-app 快;',
        },
        { emoji: '💯', text: '代码风格统一，项目统一配置 Eslint、Prettier、Husky;' },
        {
          emoji: '🥂',
          text:
            '使用 Rollup 打包你的 Typescript 库，支持 UMD、CJS、ESM 输出格式，并生成全局 .d.ts 文件;',
        },
        {
          emoji: '🍻',
          text: '支持用户自定义 Rollup 配置扩展原有的配置，为项目添加特有的功能;',
        },
        {
          emoji: '🥂',
          text:
            '使用 Webpack 打包你的 Web 应用程序,实现多环境打包部署，代码分割优化，配合官方分析工具，实时优化代码;',
        },
        {
          emoji: '🍻',
          text: '支持用户自定义 Webpack 配置扩展原有的配置，为项目添加特有的功能;',
        },
        { emoji: '🎯', text: '支用户自定义 Babel 配置，让你的程序更健壮;' },
        { emoji: '📕', text: '友好的日志输出，让你快速定位问题所在以及增加开发体验;' },
      ],
    };
  },
};
</script>

<style lang="<%= TemplateEjs.env.cssType %>" scoped>
@import "./index.<%= TemplateEjs.env.cssType %>";
</style>