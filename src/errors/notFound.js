class notFound extends Error {
  constructor(resourceType, id) {
    super(`${resourceType} with id ${id} was not found!`);
    this.name = 'notFound';
  }
}

export default notFound;
