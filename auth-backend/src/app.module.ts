import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://namanb454:Bansal020115%40@cluster0.td0gh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
