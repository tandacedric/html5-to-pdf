Stream = require '../../src/stream'

describe 'Stream', ->
  beforeEach ->
    @sut = new Stream

  it 'should of type Stream', ->
    expect(@sut).to.be.an.instanceOf Stream
