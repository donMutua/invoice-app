"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordStrength } from "check-password-strength";

import { setEmail } from "@/redux/features/verify-email-slice";
import { useAppDispatch } from "@/redux/hooks/useAppDispatch";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/passwordInput";
import { useEffect, useState } from "react";
import ShowPassStrength from "@/components/ShowPassStrength";
import { registerUser } from "@/services/apiService";

let formSchema = z
  .object({
    email: z.string().email(),
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),

    firstName: z.string().min(4, {
      message: "First name must be at least 4 characters.",
    }),
    lastName: z.string().min(4, {
      message: "Last name must be at least 4 characters.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    passwordConfirm: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords must match.",
    path: ["passwordConfirm"],
  });

type strength = 0 | 1 | 2 | 3;

export default function Registration() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [strength, setStrength] = useState<strength>(0);

  // Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const password = form.watch("password");

  useEffect(() => {
    // This code will run whenever the password changes

    setStrength(passwordStrength(password).id as strength);
  }, [password]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await registerUser(values);
      toast({
        title: "Registration Successful",
        description: `${response?.message}`,
      });

      dispatch(setEmail(values.email));
      router.push("/auth/verification");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;

      toast({
        title: "Registration Failed",
        variant: "destructive",
        description: `${errorMessage}`,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput
                  placeholder="Enter Password"
                  showPassword={showPassword}
                  setShowPassword={() => setShowPassword((prev) => !prev)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <ShowPassStrength strength={strength} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput
                  placeholder="Confirm Password"
                  showPassword={showConfirmPassword}
                  setShowPassword={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
