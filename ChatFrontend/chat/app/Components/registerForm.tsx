import { FormProps, Form, Input, Flex } from "antd";
import Button from "antd/es/button/button";
import React, { useState } from 'react';
import { UserRequest, register} from "../Services/users";
import styles from "../page.module.css"
import { maxRegistrationLenght, validationValue } from "./constants";
import { useRouter } from 'next/navigation'; //навигация


type FieldType = {
    email?: string;
    username?: string;
    password?: string;
  };


export const RegisterForm = () => {
  const [form] = Form.useForm();
  const requestBase: UserRequest = {
    email: validationValue,
    name: validationValue,
    sessionId: validationValue,
    password: validationValue,
  }; 
  const [exists, setExists] = useState<UserRequest>(requestBase);
 
 const onFinish: FormProps<FieldType>['onFinish'] = async (values: FieldType) => {
   console.log('Success:', values);
   const request: UserRequest = {
     email: values.email!,
     name: values.username!,
     sessionId: "0",
     password: values.password!,
   };   
   handleCreateUser(request);
 };
 
 const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo: object) => {
   console.log('Failed:', errorInfo);
 };

 function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}
 
 const handleCreateUser = async (request: UserRequest) => {
   const result: UserRequest = await register(request); // Получаем результат регистрации
   if (result == null) {
    loginPage();
    return
  }; // Если электронка используется впервые то просто регистрация
   await setExists(result); // Устанавливаем результат в exists для доступа в валидации
   await delay(500); // Если нет, то чуть ждем запрос и всякое нездравое
   form.validateFields(); // Обновляем условия валидации
   setExists(requestBase); // Сбрасывем значения для валидаци
 };

  const router = useRouter(); //навигация

  const loginPage = async () => {
    await router.push('/login'); //навигация
  }

    return(   
      <div className="flexHorizontalCenter">
        <Form 
            form={form}
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 24 }}
            style={{ maxWidth: '40%', margin: 'auto' }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className={styles.registerForm}
            >
            <Form.Item<FieldType>
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Введите почту' }, { type: 'email', message: 'Неверный формат почты' }, {
                  validator: () => {
                    const name = exists.name;
                    console.log(name);
                    if (name != validationValue) {
                      return Promise.reject(new Error('На эту почту уже зарегестрирован аккаунт'));
                    }
                    return Promise.resolve();
                  }
                },]}
            >
                <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="Имя"
                name="username"
                rules={[{ required: true, message: 'Введите имя пользователя' }, {max: maxRegistrationLenght, message: `Длина должна быть не более ${maxRegistrationLenght}`}]}
            >
                <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="Пароль"
                name="password"
                rules={[{ required: true, message: 'Введите пароль' }, {max: maxRegistrationLenght, message: `Длина должна быть не более ${maxRegistrationLenght}`}]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 0, span: -1 }}>
                <Flex gap="small" wrap>
                  <Button type="primary" htmlType="submit" className={styles.buttonHorizontalCenter}>
                    Зарегестрироваться
                  </Button>
                </Flex>
                <Flex gap="small" wrap>
                  <Button type="dashed" className={styles.buttonHorizontalCenter} onClick={loginPage}>
                    Уже есть аккаунт
                  </Button>
                </Flex>
            </Form.Item>
            </Form>
        </div>
    );
};