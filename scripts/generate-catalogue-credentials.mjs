import { pbkdf2Sync, randomBytes } from 'node:crypto'

if (!process.stdin.isTTY || !process.stdout.isTTY) {
  console.error('Run this script in an interactive terminal.')
  process.exit(1)
}

process.stdout.write('Catalogue password (input hidden): ')
process.stdin.setRawMode(true)
process.stdin.resume()

let password = ''
process.stdin.on('data', (buffer) => {
  for (const character of buffer.toString('utf8')) {
    if (character === '\u0003') {
      process.stdin.setRawMode(false)
      process.stdout.write('\n')
      process.exit(130)
    }
    if (character === '\r' || character === '\n') {
      process.stdin.setRawMode(false)
      process.stdin.pause()
      process.stdout.write('\n')
      if (password.length < 7) {
        console.error('Password must contain at least 7 characters.')
        process.exitCode = 1
        return
      }
      const hash = pbkdf2Sync(
        password,
        'dekode-clinics-catalogue-v1',
        100_000,
        32,
        'sha256',
      ).toString('hex')
      password = ''
      process.stdout.write(`CATALOGUE_PASSWORD_HASH=${hash}\n`)
      process.stdout.write(`CATALOGUE_SESSION_SECRET=${randomBytes(32).toString('hex')}\n`)
      return
    }
    if (character === '\b' || character === '\u007f') {
      password = password.slice(0, -1)
      continue
    }
    password += character
  }
})
