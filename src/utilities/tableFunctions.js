export const renderValue = (value) => {
  if (value === null || value === '') {
    return '--'
  } else if (typeof value === 'boolean') {
    return (
      <input
        type="checkbox"
        checked={value}
        readOnly
        className="custom-checkbox"
      />
    )
  } else {
    return value
  }
}
