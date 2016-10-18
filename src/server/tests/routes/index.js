describe('Routes: Index', () => {
  describe('GET /', () => {
    it('returns the API status', done => {
      request.get('/api/v1')
        .expect(200)
        .end((err, res) => {
          const expected = { status: 'mean API' };
          expect(res.body).to.eql(expected);
          done(err);
        });
    });
  });
});
