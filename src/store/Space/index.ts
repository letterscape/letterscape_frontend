import { spaceApi } from '@/api/space/space'
import { successCode } from '@/lib/constants'
import { makeAutoObservable } from 'mobx'

class Space {

  constructor() {
    makeAutoObservable(this)
  }

  create = (content: SpaceContent) => {
    spaceApi.create(content).then(resp => {
      if (resp && resp.code === successCode) {
        alert("success");
      } else {
        alert(resp.msg);
      }
    }).catch((error) => {
      alert(error)
    })
  }

  publish = (contentId: string) => {
    let params = {
      contentId: contentId
    }
    spaceApi.publish(params).then(resp => {
      if (resp && resp.code === successCode) {
        alert("success");
      } else {
        alert(resp.msg);
      }
    }).catch((error) => {
      alert(error)
    })
  }
  
}

export type SpaceContent = {
  contentId: string
  chainId: string
  author: `0x${string}`
  title: string
  resource: string
  favouriteNum: number
  label: number
  isShown: boolean
}

const space = new Space();
export { space }