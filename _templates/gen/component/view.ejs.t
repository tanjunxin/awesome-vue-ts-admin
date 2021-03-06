---
to: 'src/views/<%= h.changeCase.pascal(model) %>/index.tsx'
---
<%
const ModelName = h.changeCase.pascal(model)
%>import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'ModelName',
})
export default class Components extends Vue {
  render() {
    const { keepList } = this.$store.state.app;
    return (
      <keep-alive max={10} include={keepList}>
        <router-view/>
      </keep-alive>
    );
  }
}