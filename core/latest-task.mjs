export function createLatestTask() {
  let revision = 0
  return {
    begin() { revision += 1; return revision },
    isCurrent(value) { return value === revision },
    invalidate() { revision += 1 }
  }
}
