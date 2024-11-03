<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import config from "../package.json";

const about = String.raw`
This dashboard is created by Mxmilu666 and SaltWood, for Open93AtHome-V3.
Current version: ${config.version}

Open93AtHome-V3 is a project that aims to act as a file-delivery network's center server,
    and this dashboard is one of the front-end components of the project.

This software follows the MIT license.
Copyright (c) 2024 Mxmilu666 & SaltWood

https://github.com/SaltWood-Studio/Open93AtHome-V3
https://github.com/SaltWood-Studio/Open93AtHome-Dashboard
`;
// @ts-ignore
window.about = () => console.log(about);

const tip = String.raw`
/*
 *     ____                      ____ _____    ___   __     __  __                   
 *    / __ \____  ___  ____     / __ \__  /   /   | / /_   / / / /___  ____ ___  ___ 
 *   / / / / __ \/ _ \/ __ \   / /_/ //_ <   / /| |/ __/  / /_/ / __ \/ __ '__ \/ _ \
 *  / /_/ / /_/ /  __/ / / /   \__, /__/ /  / ___ / /_   / __  / /_/ / / / / / /  __/
 *  \____/ .___/\___/_/ /_/   /____/____/  /_/  |_\__/  /_/ /_/\____/_/ /_/ /_/\___/ 
 *      /_/                  
 *                       v${config.version} | Created by Mxmilu666 & SaltWood
 *                       Type "about()" for more information.
 */
`;
console.log(tip);
console.log("你怎么那么无聊来看浏览器的控制台？这里可啥都没有哦。");
</script>