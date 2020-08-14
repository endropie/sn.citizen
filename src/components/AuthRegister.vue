<template>
  <q-card v-bind="$attrs">
    <!-- <div class="text-h6 text-uppercase text-primary">{{$t('auth.register.register')}}</div> -->
    <q-form class="q-gutter-md" @submit="onSubmit">
      <q-card-section class="no-padding">
        <q-input dense
          v-model.trim="data.name"
          type="text"
          :label="$t('auth.labels.name')"
          :rules="validations['name']"
          lazy-rules
        />
        <q-input dense
          id="email"
          v-model.trim="data.email"
          type="email"
          :label="$t('auth.labels.email')"
          bottom-slots
          autofocus
          :rules="validations['email']"
          lazy-rules
        />
        <div class="row q-col-gutter-sm">
          <q-input dense class="col"
            id="password"
            v-model="data.password"
            :type="showPassword.password ? 'text' : 'password'"
            :label="$t('auth.labels.password')"
            bottom-slots no-error-icon
            :rules="validations['password']"
            required lazy-rules
          >
            <template v-slot:append>
              <q-icon
                :name="showPassword.password ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPassword.password = !showPassword.password"
              />
            </template>
          </q-input>
          <q-input dense class="col"
            id="repeatPassword"
            v-model="data.password_confirmation"
            :type="showPassword.repeatPassword ? 'text' : 'password'"
            :label="$t('auth.labels.repeat_password')"
            bottom-slots  no-error-icon
            :rules="validations['repeatPassword']"
            required lazy-rules
          >
            <template v-slot:append>
              <q-icon
                :name="showPassword.repeatPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPassword.repeatPassword = !showPassword.repeatPassword"
              />
            </template>
          </q-input>
        </div>
      </q-card-section>
      <q-card-actions class="no-padding">
        <q-btn class="full-width"
          :label="$t('auth.register.register')"
          color="primary"
          type="submit"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<style>
</style>

<script>
import MixForm from '@/mixins/MixForm'
// import isEmail from 'validator/es/lib/isEmail'
// import equals from 'validator/es/lib/equals'
// import isAlphanumeric from 'validator/es/lib/isAlphanumeric'
// import isString from 'validator/es/lib/isAlphanumeric'

export default {
  name: 'AuthRegister',
  mixins: [MixForm],
  props: {
    minPasswordLength: {
      type: Number,
      default: 8
    }
  },
  data () {
    return {
      data: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      validations: {
        name: [
          // val => isString(val) || this.$t('auth.validations.failed'),
          val => !!val || this.$t('auth.validations.required')
        ],
        email: [
          // val => isEmail(val) || this.$t('auth.validations.email'),
          val => !!val || this.$t('auth.validations.required')
        ],
        password: [
          val => !!val || this.$t('auth.validations.required'),
          val =>
            val.length >= this.minPasswordLength ||
            this.$t('auth.validations.passwordLength', 1, { v: this.minPasswordLength })
        ],
        repeatPassword: [
          val => !!val || this.$t('auth.validations.required'),
          val =>
            // equals(val, this.data.password) ||
            this.$t('auth.validations.password_match')
        ]
      },
      showPassword: {
        password: false,
        repeatPassword: false
      }
    }
  },
  methods: {
    onSubmit () {
      this.$q.loading.show()
      this.$auth
        .register(this.data)
        .then(() => {
          this.setLogin()
        })
        .catch(error => {
          if (error.response) {
            console.error('[APP] error response', error.response)
            if (error.response.status === 422) {
              this.$q.notify({ message: this.$t('auth.register.invalid_data') })
            } else if (error.response.status === 409) {
              this.$q.notify({ message: this.$t('auth.register.already_registered') })
            } else {
              this.$q.notify({ message: this.$t('auth.register.invalid_data') })
            }
          }
        })
        .finally(() => {
          this.$q.loading.hide()
        })
    },
    setLogin () {
      this.$q.loading.show()
      this.$auth
        .login({ body: this.data })
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
