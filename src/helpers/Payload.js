class Payload {
  constructor({
    sub, exp, scope, iat,
  }) {
    this.sub = sub;
    this.exp = exp;
    this.scope = scope;
    this.iat = iat;
    if (!this.sub) throw new Error('sub property is required');
    if (!this.exp) throw new Error('exp property is required');
    if (!this.scope) throw new Error('scope property is required');
    if (!this.iat) throw new Error('iat property is required');
  }
}

export default Payload;
