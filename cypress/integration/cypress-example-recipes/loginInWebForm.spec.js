describe('登录', () => {
  // 此用户名和密码为例子默认正确访问
  const userName = 'jane.lane';
  const password = 'password123';
  context('loginInWebForm 登录测试', () => {
    it('期待登录成功', () => {
      cy.visit('http://localhost:7077/login');
      cy.get('input[name=username').type(userName);
      cy.get('input[name=password]').type(password);
      cy.get('form').submit();
      // 登录成功则跳转至 dashboard 页面，并且显示当前登录用户
      cy.url().should('include', '/dashboard');
      cy.get('h1').should('contain', 'jane.lane');
    })
  })
})
