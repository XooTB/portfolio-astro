---
name: migrate-react-component
description: Guildelines to follow when migrating a react-component to any other framework, for example astro or svelte.
allowed-tools: Grep, cd, ls, Read, Write
---

When migrating a react-component to any other framework, always keep in mind these things:

- In the target framework, what's the react equivalent to components. What's the general structure of the said components.
- Prioritize the utlization of the native API and features of the target framework, Maximizing the support compatibility of the said framework.
- Make sure the design scheme and structure of the original react-component is followed.
- For Icons and stuff, look for equivalent library for the target framework, if it's not installed make sure to prompt the user to let them know of the library and ask for user confirmation before installing, If already installed then proceed to use that. example: lucide-react to @lucide/astro for astro framework.
- If a component has multiple smaller parts that can be generalized into multipe components, then verify if those individual components exist separately, If not, priorotize creating the generalized components first before using those to translate the greater component.
