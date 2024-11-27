import { makeAutoObservable } from 'mobx';

class Global {
  constructor() {
    // makeAutoObservable: 自动将所有属性和方法转换为可观察对象。
    makeAutoObservable(this);
  }
  count = 0;
  name = 'react';
  loading = true;

  addCount = () => {
    this.count++;
  };
  setName = (data: string) => {
    this.name = data;
  };
}

const globalStore = new Global();
export { globalStore };
