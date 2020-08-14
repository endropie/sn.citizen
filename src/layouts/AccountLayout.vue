<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal elevated>
      <q-toolbar>
        <q-btn flat dense round icon="widgets" aria-label="W" />
        <q-toolbar-title>
          {{ TITLE }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-footer elevated class="bg-grey-3 text-dark">
      <q-toolbar>
        <q-toolbar-title>
          <q-tabs v-model="tab" align="justify">
            <q-tab name="home" icon="home" />
            <q-tab name="setting" icon="settings" />
            <q-tab name="bills" icon="info" />
          </q-tabs>
        </q-toolbar-title>
        <q-btn dense rounded flat icon="exit_to_app" @click="logout" />
      </q-toolbar>
    </q-footer>
    <q-page-container>
      <q-page padding>
        <account-setting v-if="tab === 'setting'" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import AccountSetting from '@/components/account/Setting'
export default {
  name: 'AdminLayout',
  components: { AccountSetting },
  data () {
    return {
      tab: 'home',
      titles: {
        home: 'Home',
        bills: 'Bills',
        setting: 'Setting'
      }
    }
  },
  computed: {
    TITLE () {
      return this.titles[this.tab]
    }
  },
  methods: {
    logout () {
      this.$q.dialog({ title: 'Confirm', message: 'are you sure logout ?' })
        .onOk(() => {
          this.$auth.logout()
          this.$router.push('/')
        })
    }
  }
}
</script>
