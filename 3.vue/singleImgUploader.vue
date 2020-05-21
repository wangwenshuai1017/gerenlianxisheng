<template>
  <!-- 
  how to use:
  1. import this component in your .vue
  2. use it as a tag
  3. use v-on:uploaded to listener img uploaded event.
     this event will provide you 'localUrl' and 'cloudUrl'
  4. use v-on:upload-failed to listener img upload failed event.
     this event will provide you 'localUrl'
  5. ★★★[recommend]★★★ use v-model:yourData to bind an objet contains 'localUrl','cloudUrl','status'
  6. use v-bind:size="yourSize" to set size, e.g. :size="{width: '60px', height: '60px'}"
  -->
  <div class="singleImgUploader">
    <div class="uploadContainer" @mouseover="onOverUploader" @mouseout="onOutUploader">
      <el-upload
        ref="uploader"
        :class="classUpload"
        accept="image/jpg, image/jpeg, image/gif, image/png, image/bmp"
        :auto-upload="true"
        :action="imgUploadPath"
        :show-file-list="false"
        :headers="tokenHeaders"
        :on-change="onImgPreview"
        :before-upload="beforeUpload"
        :on-success="onUploaded"
        :on-error="onUploadFailed"
        :style="{width:viewSize.width, height:viewSize.height}"
        :result="uploadResult"
        :disabled="disabled"
      >
        <el-popover
          v-if="imgUrl()"
          placement="left-end"
          :title="uploadResult.fileName"
          trigger="hover"
        >
          <img :src="imgUrl()" :alt="uploadResult.fileName">
          <div
            slot="reference"
            class="imgThumbnail"
            :style="{backgroundImage:'url(' + (imgUrl()) + ')', width:viewSize.width, height:viewSize.height}"
          ></div>
        </el-popover>
        <i v-else :class="classPlusIcon"></i>
      </el-upload>
      <el-button v-if="showRemoveBtn" class="removeImgBtn" type="text" @click="removeImg">
        <i class="el-icon-circle-close"></i>
      </el-button>
    </div>
    <i
      v-if="uploadResult.localUrl && uploadResult.status === 0"
      class="el-icon-loading"
      :title="$t('common.statusUploading')"
    ></i>
    <i
      v-if="uploadResult.localUrl && uploadResult.status === 1"
      class="el-icon-warning"
      :title="$t('common.statusUploadFailed')"
    ></i>
    <i
      v-if="uploadResult.localUrl && uploadResult.status === 2"
      class="el-icon-success"
      :title="$t('common.statusUploadSuccess')"
    ></i>
    <span class="ruleTip" v-if="validCheck && ruleTip">{{ruleTip}}</span>
  </div>
</template>

<script>
  import { getToken } from "@/utils/auth";
  import { getCommonUploadPath } from "@/api/upload";
  export default {
    data() {
      return {
        showRemoveBtn: false,
        uploadResult: {
          fileName: "",
          localUrl: "",
          cloudUrl: "",
          status: 0
        },
        viewSize: {
          width: "36px",
          height: "36px"
        }
      };
    },
    model: {
      prop: "result",
      event: "onResultChange"
    },
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      result: {
        fileName: "",
        localUrl: "",
        cloudUrl: "",
        status: 0
      },
      size: {
        width: "",
        height: ""
      },
      validCheck: {
        type: Function
      },
      ruleTip: {
        type: String
      }
    },
    watch: {
      result(newResult) {
        console.log("---------- watch result:");
        this.updateResult(newResult);
      },
      size(newSize) {
        console.log("newSize:", newSize);
        if (newSize) {
          if (newSize.width) this.viewSize.width = newSize.width;
          if (newSize.height) this.viewSize.height = newSize.height;
        }
      }
    },
    computed: {
      tokenHeaders() {
        return { "X-Token": getToken() };
      },
      imgUploadPath() {
        return getCommonUploadPath();
      },
      classUpload() {
        return this.disabled ? 'singleImgUpload-disabled' : 'singleImgUpload';
      },
      classPlusIcon() {
        return this.disabled ? 'el-icon-plus smallUploaderIcon-disabled' : 'el-icon-plus smallUploaderIcon';
      }
    },
    methods: {
      imgUrl() {
        return this.uploadResult.localUrl || this.uploadResult.cloudUrl;
      },
      updateResult(newResult) {
        console.log('---------- updateResult ----------');
        console.log('oldResult', this.uploadResult);
        console.log('newResult', newResult);
        console.log('------------------------------------');
        this.uploadResult = newResult;
      },
      onOverUploader() {
        this.showRemoveBtn = !this.disabled && this.imgUrl();
        const uploader = this.$refs['uploader'];
        if (uploader) {
          for (const index in uploader.$children) {
            if (uploader.$children.hasOwnProperty(index)) {
              const child = uploader.$children[index];
              if (child.$el && child.$el.className && child.$el.className.indexOf("el-upload") != -1) {
                child.$el.style.cursor = this.disabled ? 'not-allowed' : 'pointer';
              }
            }
          }
        }
      },
      onOutUploader() {
        this.showRemoveBtn = false;
      },
      removeImg() {
        this.uploadResult.cloudUrl = "";
        this.uploadResult.localUrl = "";
        this.uploadResult.fileName = "";
        this.uploadResult.status = 0;
        this.showRemoveBtn = false;
      },
      checkFile(file) {
        if (this.validCheck) {
          return this.validCheck(file);
        } else {
          // default
          const regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
          return regex.test(file.name.toLowerCase());
        }
      },
      checkFileFailedTip() {
        if (this.validCheck && this.ruleTip)
          return this.ruleTip;
        return "please select image file. (请选择图片文件)";
      },
      // 图片回显时仅设置本地url
      onImgPreview(file) {
        if (!file) {
          return;
        }
        if (file.url === this.uploadResult.localUrl) {
          return;
        }
        console.log("onImgPreview", file);
        if (this.checkFile(file)) {
          this.uploadResult.fileName = file.name;
          this.uploadResult.localUrl = file.url;
          this.uploadResult.status = 0;
        } else {
          this.uploadResult.fileName = "";
          this.uploadResult.localUrl = "";
          this.uploadResult.status = 1;
          this.$message.error(this.checkFileFailedTip());
        }
        this.$emit("onResultChange", {
          fileName: this.uploadResult.fileName,
          localUrl: this.uploadResult.localUrl,
          cloudUrl: "",
          status: this.uploadResult.status
        });
      },
      beforeUpload(file) {
        return this.checkFile(file);
      },
      onUploadFailed(res, file) {
        console.log('onUploadFailed response', res);
        this.uploadResult.status = 1;
        this.$emit("onResultChange", {
          fileName: this.uploadResult.fileName,
          localUrl: file.url,
          cloudUrl: "",
          status: this.uploadResult.status
        });
        this.$emit("upload-failed", { localUrl: file.url });
      },
      onUploaded(res, file) {
        console.log('onUploaded response', res);
        if (!res || res.bizCode != 200) {
          this.onUploadFailed(res, file);
        } else {
          this.uploadResult.status = 2;
          this.$emit("onResultChange", {
            fileName: this.uploadResult.fileName,
            localUrl: file.url,
            cloudUrl: res.data.imageUrl,
            status: this.uploadResult.status
          });
          this.$emit("uploaded", { localUrl: file.url, cloudUrl: res.data.imageUrl });
        }
      },
      initFromProps() {
        console.log('---------- initFromProps');
        if (this.result) {
          this.updateResult(this.result);
        }
        if (this.size) {
          if (this.size.width) this.viewSize.width = this.size.width;
          if (this.size.height) this.viewSize.height = this.size.height;
        }
      }
    },
    mounted() {
      this.$on("onResultChange", function(result) {
        console.log('---------- onResultChange');
        this.updateResult(result);
      });
      this.initFromProps();
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  * {
    margin: 0;
    padding: 0;
  }
  .singleImgUploader {
    text-align: left;
    .uploadContainer {
      position: relative;
      display: inline-block;
      .singleImgUpload {
        // width: 36px;
        // height: 36px;
        border: 1px dashed #d9d9d9;
        border-radius: 4px;
        text-align: center;
        vertical-align: middle;
        overflow: hidden;
        display: inline-flex;
        &:hover {
          border-color: #409eff;
        }
        &-disabled {
          border: 1px dashed #d9d9d9;
          border-radius: 4px;
          text-align: center;
          vertical-align: middle;
          overflow: hidden;
          display: inline-flex;
          background-color: #f5f7fa;
        }
      }
      .el-upload {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        outline: 0;
        width: 100%;
        height: 100%;
      }
      .imgThumbnail {
        // width: 36px;
        // height: 36px;
        display: block;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
      }
      .smallUploaderIcon {
        font-size: 14px;
        text-align: center;
        color: #a9a9a9;
        &:hover {
          color: #409eff;
        }
        &-disabled {
          font-size: 14px;
          text-align: center;
          color: #a9a9a9;
        }
      }
      .removeImgBtn {
        padding: 0;
        color: red;
        position: absolute;
        top: 1px;
        right: 0px;
        transform: translateY(-50%) translateX(50%);
      }
    }
    .el-icon-success {
      color: limegreen;
    }
    .el-icon-warning {
      color: red;
    }
    .ruleTip {
      margin-left: 8px;
      float: none!important;
      font-weight: normal!important;
      color: orange!important;
    }
  }
  .el-popover {
    .el-popover__title {
      text-align: center;
      font-size: 12px;
    }
    img {
      max-width: 400px;
      max-height: 400px;
    }
  }
</style>
