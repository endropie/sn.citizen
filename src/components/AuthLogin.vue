<template>
  <q-card v-bind="$attrs" >
    <!-- <div class="text-h6 text-uppercase text-primary">{{$t('auth.login.title')}}</div> -->
    <q-form @submit="onSubmit" class="column " >
      <q-card-section class="q-col-gutter-lg no-padding" >
          <q-input dense type="email"
            id="email"
            v-model.trim="data.body.email"
            :label="this.$t('auth.login.email')"
            :rules="validations['email']"
            lazy-rules
            autofocus
          />
          <q-input dense type="password"
            id="password"
            v-model="data.body.password"
            :label="this.$t('auth.login.password')"
            :rules="validations['password']"
            lazy-rules
          />
          <div class="row justify-between no-wrap q-my-sm">
            <q-checkbox id="rememberMe" v-model="data.rememberMe" :label="this.$t('auth.login.remember_me')" />
            <q-space />
            <span>
              <q-btn dense flat no-caps size="sm" tabindex="100"
                :label="$t('auth.login.password_forgot')"
                @click="$emit('tab','forgot')" />
            </span>
          </div>
      </q-card-section>

      <q-card-actions class="no-padding">
        <q-btn type="submit" class="full-width" :label="$t('auth.login.login')" color="primary" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import MixForm from '@/mixins/MixForm'
// import isEmail from 'validator/lib/isEmail'
export default {
  name: 'AuthLogin',
  mixins: [MixForm],
  data () {
    return {
      profile: null,
      data: {
        body: {
          email: '',
          password: ''
        },
        rememberMe: false
      },
      validations: {
        email: [
          // val => isEmail(val) || this.$t('auth.validations.email'),
          val => !!val || this.$t('auth.validations.required')
        ],
        password: [val => !!val || this.$t('auth.validations.required')]
      }
    }
  },
  computed: {
    location () {
      return window.location.host
    }
  },
  created () {
    this.load()
  },
  methods: {
    load () {
      // if (this.$store.getters['auth/loggedIn']) {
      //   this.$emit('hide')
      //   this.$router.replace('/admin')
      // }
    },
    onSubmit () {
      this.$q.loading.show()
      this.$auth
        .login(this.data)
        .then(() => {
          this.$emit('done')
        })
        .catch(error => {
          this.FORM.response.validate(error)
          this.FORM.response.error(error, this.$tc('auth.login.failed'))
        })
        .finally(() => {
          this.$q.loading.hide()
        })
    }
  }
}
</script>
