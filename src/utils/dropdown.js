import axios from 'axios'

export function getDepartments () {
  axios.get(`dep`)
    .then(res => {
      if (!res.data.success) return this.$message.error(res.data.msg)
      console.log(res.data)
      return res.data.data
    })
}
