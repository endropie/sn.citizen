<template>
  <q-page padding class="flex justify-center">
    <div class="q-mt-md" :style="`width:${$q.screen.lt.sm ? '18' : '22'}rem`">
      <q-card>
        <q-card-section class="bg-indigo-5 text-white text-center">
          <q-icon name="widgets" class="text-h1" />
          <div>
            <span class="text-h6"> REALTIME </span>
            <span class="text-caption text-" >V.1</span>
          </div>
        </q-card-section>
        <q-tabs
          v-model="tab"
          align="justify"
          narrow-indicator
          active-color="white"
          :active-bg-color="tab === 'register' ? 'secondary' : 'blue-grey-4'"
        >
          <q-tab class="text-primary" name="login" label="Login" />
          <q-tab name="register" label="Register" />
          <!-- <q-tab class="text-teal" name="forgot" label="Forgot" /> -->
        </q-tabs>
        <q-separator />
        <q-card-section class="q-py-none">
          <q-tab-panels v-model="tab" animated transition-prev="scale" transition-next="scale">
            <q-tab-panel name="login">
              <auth-login flat class="fit" @done="logged" @tab="v => tab = v" />
            </q-tab-panel>

            <q-tab-panel name="register">
              <auth-register flat class="fit" @done="registered" />
            </q-tab-panel>

            <q-tab-panel name="forgot">
              <div class="text-h6">Forgot Password</div>
              Nostrum necessitatibus expedita dolores? Voluptatem repudiandae magni ea.
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </q-card>
    </div>
  <q-btn class="q-ma-md fixed-bottom-left" color="blue-grey" icon="mdi-transfer-left" label="Landing" to="/" />
  </q-page>
</template>

<script>
import AuthLogin from '@/components/AuthLogin'
import AuthRegister from '@/components/AuthRegister'

export default {
  name: 'Authentication',
  components: { AuthLogin, AuthRegister },
  data () {
    return {
      tab: 'login'
    }
  },
  methods: {
    logged () {
      this.$router.push('/account')
    },
    registered () {
      this.$router.push('/')
    }
  }
}
</script>
