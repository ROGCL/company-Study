<template>
  <div>
    <el-dialog
      :title="editData.title"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="active">
        <span class="title">已选渠道：</span>
        <div class="tag-wrap">
          <el-tag v-for="tag in tagActive" :key="tag.id" closable @close="close(tag)">{{tag}}</el-tag>
        </div>
      </div>
      <div class="all">
        <span class="title">全部渠道：</span>
        <div class="tag-wrap">
          <el-tag v-for="(tag, index) in tags" :key="index" @click="choice(index)">{{tag}}</el-tag>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Channel_Manage_save } from '@/config/api/index'
import { mapState } from 'vuex'
export default {
  props: {
    editData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dialogVisible: false,
      tagActive: [],
    }
  },
  computed: {
    ...mapState({
      tags: (state) => state.channel.data,
    }),
  },
  methods: {
    handleClose(done) {
      done()
    },
    choice(index) {
      this.tagActive.push(this.tags[index])
    },
    close(tag) {
      this.tagActive.splice(this.tagActive.indexOf(tag), 1)
    },
    submit() {
      Channel_Manage_save({
        id: this.editData.id,
        channels: this.tagActive.join(','),
      }).then((res) => {
        if (res[2] == 1) {
          this.$emit('updated')
          this.dialogVisible = false
        }
      })
    },
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.tagActive = this.editData.channel
          ? this.editData.channel.slice(0, this.editData.channel.length)
          : []
      } else {
        this.$emit('clearEditData')
      }
    },
  },
}
</script>

<style lang='scss' scoped>
.el-tag {
  margin: 0 10px 10px 0;
}

.all .el-tag {
  cursor: pointer;
}

.title {
  line-height: 40px;
}

.tag-wrap {
  border: 1px solid #ededed;
  padding: 20px;
}
</style>