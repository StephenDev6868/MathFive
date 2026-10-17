<template>
  <div class="m5-auth-shell">
    <div class="m5-auth-shell__backdrop" aria-hidden="true" />
    <span class="m5-auth-doodle m5-auth-doodle--one" aria-hidden="true">×</span>
    <span class="m5-auth-doodle m5-auth-doodle--two" aria-hidden="true">÷</span>
    <span class="m5-auth-doodle m5-auth-doodle--three" aria-hidden="true">+</span>

    <header class="m5-auth-header">
      <NuxtLink to="/" class="m5-auth-brand" aria-label="MathFive - về trang chủ">
        <img src="/math5/decorations/book-badge.svg" alt="" />
        <span>
          <strong>Math<em>Five</em></strong>
          <small>Học Toán lớp 5</small>
        </span>
      </NuxtLink>
      <NuxtLink to="/" class="m5-auth-home-link">
        <ArrowLeft :size="18" aria-hidden="true" />
        <span>Về trang chủ</span>
      </NuxtLink>
    </header>

    <main class="m5-auth-main">
      <section class="m5-auth-panel" aria-label="Đăng nhập"><slot /></section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
</script>

<style scoped>
.m5-auth-shell{--auth-coral:#f45f4b;--auth-ink:#26375d;min-height:100svh;position:relative;isolation:isolate;display:flex;flex-direction:column;overflow:hidden;padding:0 clamp(18px,4vw,64px);color:var(--auth-ink);font-family:var(--m5-font);background:#f8e6d2}
.m5-auth-shell__backdrop{position:absolute;z-index:-2;inset:0;background:linear-gradient(90deg,rgba(255,250,241,.94) 0%,rgba(255,249,239,.85) 48%,rgba(255,244,226,.76) 100%),url('/math5/backgrounds/classroom-window.webp') center/cover no-repeat}
.m5-auth-shell::after{content:'';position:absolute;z-index:-1;inset:auto 0 0;height:27%;background:linear-gradient(180deg,transparent,rgba(173,106,59,.16))}
.m5-auth-header{width:min(100%,1180px);min-height:86px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:24px}
.m5-auth-brand{display:flex;align-items:center;gap:10px;color:inherit;text-decoration:none}.m5-auth-brand img{width:50px;height:50px}.m5-auth-brand strong{display:block;font:800 22px/1 var(--m5-heading);letter-spacing:-.35px}.m5-auth-brand strong em{color:var(--auth-coral);font-style:normal}.m5-auth-brand small{display:block;margin-top:5px;color:#788096;font-size:11px;font-weight:800}
.m5-auth-home-link{min-height:44px;display:inline-flex;align-items:center;gap:7px;padding:0 15px;border:1px solid rgba(224,196,173,.8);border-radius:999px;background:rgba(255,253,248,.75);color:#59647b;font-size:13px;font-weight:900;text-decoration:none;transition:.2s ease}.m5-auth-home-link:hover{transform:translateY(-1px);border-color:#f0ad9f;color:#d9503f;background:#fffaf3}
.m5-auth-main{width:min(100%,480px);flex:1;margin:auto;display:grid;place-items:center;padding:22px 0 38px}.m5-auth-panel{width:100%}.m5-auth-doodle{position:absolute;z-index:-1;color:rgba(244,95,75,.12);font:800 54px/1 var(--m5-heading);transform:rotate(-12deg)}.m5-auth-doodle--one{left:7%;top:29%}.m5-auth-doodle--two{right:7%;top:24%;color:rgba(61,149,126,.13);transform:rotate(11deg)}.m5-auth-doodle--three{right:12%;bottom:14%;color:rgba(75,137,205,.11);transform:rotate(-8deg)}
@media(max-width:560px){.m5-auth-shell{padding:0 14px}.m5-auth-header{min-height:70px}.m5-auth-brand img{width:42px;height:42px}.m5-auth-brand strong{font-size:18px}.m5-auth-brand small{display:none}.m5-auth-home-link{width:44px;padding:0;justify-content:center}.m5-auth-home-link span{display:none}.m5-auth-main{display:block;padding:28px 0}.m5-auth-doodle--one{left:2%;top:22%}.m5-auth-doodle--two{right:2%;top:18%}}
@media(max-height:760px) and (min-width:561px){.m5-auth-header{min-height:72px}.m5-auth-main{padding:16px 0}}
@media(prefers-reduced-motion:reduce){.m5-auth-home-link{transition:none}}
</style>
