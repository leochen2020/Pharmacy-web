<template>
  <DIV class="hello">
    <DIV class="background-main">
      <DIV class="DesktopBg blurrbg"></DIV>
      <DIV class="overlay-blk"></DIV>
    </DIV>

    <DIV class="content-box absolute-center">
      <DIV class="mainContentBg"></DIV>
      <DIV class="mainContentBlurr blurrbg"></DIV>
      <DIV class="GlassPane">

        <DIV class="branding-header">
          <DIV class="circle-ring">
            <DIV class="circle-solid"></DIV>
          </DIV>

          <DIV class="name-bar-title">
            <DIV class="app-name">Pharmacy Server</DIV>
            <DIV class="descriptor">Pharmacy inventory Management System</DIV>
          </DIV>
        </DIV>

        <DIV class="content-area-box">
          <DIV class="row form-group space">
            <INPUT :value="name" tabindex="1" @input="name= $event.target.value" class="form-control" type="text" placeholder="用户名" />
          </DIV>
          <DIV class="row form-group space">
            <INPUT name="password" tabindex="2" title="密码" :value="password" @input="password= $event.target.value"
              class="form-control" type="password" placeholder="密码" />
          </DIV>

          <DIV class="row form-group space" style="text-align: left; padding-top: 15px;">
            <BUTTON class="btn btn-default button-signin" tabindex="3" @click="login()">登录</BUTTON>

          </DIV>
        </DIV>
      </DIV>
    </DIV>
  </DIV>
</template>

<script>
import mInput from '../components/m-input.vue'
import '@/assets/login.css'

export default {
  name: 'HelloWorld',
  components: {
    mInput
  },
  data () {
    return {
      password: '',
      name: ''
    }
  },
  methods: {
    login: function () {
      let postData = {
        name: this.name,
        password: this.password
      }
      let _this = this
      this.$ajax.get('/all/token', {
        params: {
          ...postData
        }
      })
        .then(function (response) {
          console.log(response)
          let data = response.data
          if (data.code === 10) {
            localStorage.setItem('token', data.data)
            _this.$router.push('/main')
          } else {
            _this.$message({
              offset: 300,
              type: 'error',
              message: data.msg
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
