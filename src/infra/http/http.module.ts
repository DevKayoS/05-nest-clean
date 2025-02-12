import { Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateConroller } from './controllers/authenticate.controller'
import { CreateQuestionController } from 'src/controllers/create-question.controller'
import { FetchRecentQuestionsController } from 'src/controllers/fetch-recent-questions.controller'
import { DataBaseModule } from '../database/database.module'

@Module({
  imports: [
    DataBaseModule
  ],
  controllers: [
    CreateAccountController,
    AuthenticateConroller,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
})
export class HttpModule {}
