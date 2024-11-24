import { FormProps, Form, Input, Flex } from "antd";
import Button from "antd/es/button/button";
import React, { useEffect, useState } from 'react';
import { getByEmail, login, UserLoginRequest, UserRequest } from "../Services/users";
import styles from "../page.module.css"
import { maxRegistrationLenght, validationValue } from "./constants";
import { useRouter } from 'next/navigation'; //навигация

type FieldType = {
    email?: string;
    password?: string;
  };
  

export const LoginForm = () => {
  const [form] = Form.useForm();
  const requestBase: UserRequest = {
    email: validationValue,
    name: validationValue,
    sessionId: validationValue,
    password: validationValue,
  }; 
  let [exists] = useState<UserRequest>(requestBase);
  let [isSubmitClicked] = useState(false);
  const router = useRouter(); //навигация
  const [isPortrait, setIsPortrait] = useState<boolean>(false);

  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  const onFinish: FormProps<FieldType>['onFinish'] = async (values: FieldType) => {
    const requestLogin: UserLoginRequest = {
        email: values.email!,
        password: values.password!,
      };
      //console.log(values.email);
      //login(requestLogin);
      await handleSubmit(requestLogin);
  };
  
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo: object) => {
    console.log('Failed:', errorInfo);
  };

  const handleSubmit = async (requestLogin: UserLoginRequest) => {
    await console.log("requestLogin.email " + requestLogin.email);
    //await setExists(await getByEmail(requestLogin.email));
    exists = await getByEmail(requestLogin.email);
    await delay(500);
    await console.log(exists.email);
    if(exists.email == "-1" || exists.email == "0"){
      //await setIsSubmitClicked(true);
      isSubmitClicked = true;
      //await delay(1000);
      await form.validateFields(); // Обновляем условия валидации
      return;
    }
    await console.log(`login(${requestLogin.email}; ${requestLogin.password});`);
    await login(requestLogin);
    await callsPage();
};

  const registerPage = async () => {
    await router.push('/'); //навигация
  }
  const callsPage = async () => {
    await router.push('/calls'); //навигация
  }
  

  // Обработчик изменения размера окна
  const handleResize = () => {
    if (typeof window !== 'undefined'){
      setIsPortrait(window.innerWidth < window.innerHeight);
    }
  };

  // Используем useEffect для добавления слушателя события resize
  useEffect(() => {
    if (typeof window !== 'undefined'){
      setIsPortrait(window.innerWidth < window.innerHeight);
      window.addEventListener('resize', handleResize);

      // Очистка обработчика при размонтировании компонента
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);
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
                rules={[{ required: true, message: 'Введите почту' }, 
                  { type: 'email', message: 'Неверный формат почты' }, {
                  validator: (_, value) => {
                    console.log(isSubmitClicked);
                    if(!isSubmitClicked) return Promise.resolve();
                    if(isSubmitClicked){
                      console.log(exists.email);
                      if (exists.email != value) {
                        isSubmitClicked = false;
                        return Promise.reject(new Error('Аккаунт ещё не создан!'));
                      }
                      isSubmitClicked = false;
                    }
                  }
                }]}
            >
                <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="Пароль"
                name="password"
                rules={[{ required: true, message: 'Введите пароль' }, 
                  {max: maxRegistrationLenght, message: `Длина должна быть не более ${maxRegistrationLenght}`}]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 0, span: -1 }}>
                <Flex gap="small" wrap>
                  <Button type="primary" htmlType="submit" className={styles.buttonHorizontalCenter}>
                    Войти
                  </Button>
                </Flex>
                <Flex gap="small" wrap>
                  <Button type="dashed" className={styles.buttonHorizontalCenter} onClick={registerPage}
                  style={{
                    transform: isPortrait ? 'translateX(-15%)' : 'none',
                  }}>
                    Перейти на страницу создания аккаунта
                  </Button>
                </Flex>
            </Form.Item>
            </Form>
        </div>
    );
};