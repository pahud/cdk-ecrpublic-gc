# API Reference

**Classes**

Name|Description
----|-----------
[Handler](#cdk-ecrpublic-gc-handler)|The default handler.
[TidyUp](#cdk-ecrpublic-gc-tidyup)|The primary consruct to tidy up ECR public images.


**Structs**

Name|Description
----|-----------
[HandlerProps](#cdk-ecrpublic-gc-handlerprops)|properties for the Handler.
[TidyUpProps](#cdk-ecrpublic-gc-tidyupprops)|Properties for TidyUp construct.



## class Handler  <a id="cdk-ecrpublic-gc-handler"></a>

The default handler.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new Handler(scope: Construct, id: string, props: HandlerProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[HandlerProps](#cdk-ecrpublic-gc-handlerprops)</code>)  *No description*
  * **repository** (<code>Array<string></code>)  *No description* 



### Properties


Name | Type | Description 
-----|------|-------------
**function** | <code>[IFunction](#aws-cdk-aws-lambda-ifunction)</code> | <span></span>



## class TidyUp  <a id="cdk-ecrpublic-gc-tidyup"></a>

The primary consruct to tidy up ECR public images.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new TidyUp(scope: Construct, id: string, props: TidyUpProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[TidyUpProps](#cdk-ecrpublic-gc-tidyupprops)</code>)  *No description*
  * **repository** (<code>Array<string></code>)  The ECR public repositories to check. 
  * **function** (<code>[IFunction](#aws-cdk-aws-lambda-ifunction)</code>)  your custom function to process the garbage collection. __*Default*__: a default function will be created
  * **schedule** (<code>[Schedule](#aws-cdk-aws-events-schedule)</code>)  The schedule to trigger the state machine. __*Default*__: every 4 hours



### Properties


Name | Type | Description 
-----|------|-------------
**repository** | <code>Array<string></code> | <span></span>



## struct HandlerProps  <a id="cdk-ecrpublic-gc-handlerprops"></a>


properties for the Handler.



Name | Type | Description 
-----|------|-------------
**repository** | <code>Array<string></code> | <span></span>



## struct TidyUpProps  <a id="cdk-ecrpublic-gc-tidyupprops"></a>


Properties for TidyUp construct.



Name | Type | Description 
-----|------|-------------
**repository** | <code>Array<string></code> | The ECR public repositories to check.
**function**? | <code>[IFunction](#aws-cdk-aws-lambda-ifunction)</code> | your custom function to process the garbage collection.<br/>__*Default*__: a default function will be created
**schedule**? | <code>[Schedule](#aws-cdk-aws-events-schedule)</code> | The schedule to trigger the state machine.<br/>__*Default*__: every 4 hours



