## 元素截图

snapshot标签是官方提供的可供截图的元素容器

在使用Snapshot.takeSnapshot(Object object)方法可以实现内容导出为图片

`示例代码`

```js
const el = this.createSelectorQuery().select("#view")
    el.fields({
        node: true, // 返回节点对应的 Node 实例
        size: true  // 返回节点尺寸（width height）
      })
      .exec(res => {
        const node = res[0].node
        node.takeSnapshot({
          type: 'arraybuffer',
          format: 'png',
          success: (res) => {
            const uint8Array = new Uint8Array(res.data);
            const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
            const base64Str = wx.arrayBufferToBase64 ? wx.arrayBufferToBase64(uint8Array) : this._btoa(binaryString); 
			
            // base64格式的图片数据
            const imageDataUrl = `data:image/jpeg;base64,${base64Str}`;
              
              
          this.setData({
            imgSrc: imageDataUrl
          })
            wx.editImage({
              src: imageDataUrl, // 临时图片路径
              success: (res) => {
                wx.saveImageToPhotosAlbum({
                  filePath: imageDataUrl,
                  success(res) {
                    wx.showToast({
                      title: '保存成功',
                    })
                  }
                })
              }
            })
          },
          fail(res) {
            console.log("takeSnapshot fail:", res)
          }
        })
      })
```

