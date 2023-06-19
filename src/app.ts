import fastify from 'fastify'

import { ZodError } from 'zod'

import { env } from './env'

export const app = fastify()

app.get('/healthcheck', (_, reply) =>
  reply.send({ status: 'API is working! ♻' }),
)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.issues.map(
        (issue) =>
          `${issue.path.join('.')} is ${issue.message.toLocaleLowerCase()}`,
      ),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Send error to Sentry, Datadog, NewRelic
  }

  return reply.status(500).send({ message: 'Internal server error' })
})
