export function Sidebar () {
  return (
    <nav role='sidebar'>
      <ul className='flex flex-col gap-4 w-xs p-16'>
        <li>
          <a href="/products">Products</a>
        </li>
        <li>
          <a href="">Orders</a>
        </li>
        <li>
          <a href="/user/profile">User</a>
        </li>
        <li>
          <a href="/user/setting">Settings</a>
        </li>
      </ul>
    </nav>
  )
}