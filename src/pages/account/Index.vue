<template>
  <q-page padding>
    <account-setting />
  </q-page>
</template>

<script>
import AccountSetting from '@/components/account/Setting'
export default {
  name: 'AccountIndex',
  components: { AccountSetting }
}
</script>
