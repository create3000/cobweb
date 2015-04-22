
define ([
	"jquery",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Basic/X3DField",
	"cobweb/Basic/X3DArrayField",
	"cobweb/Fields",
	"cobweb/Browser/X3DBrowser",
	"cobweb/Execution/X3DExecutionContext",
	"cobweb/Execution/X3DScene",
	"cobweb/Prototype/ExternProtoDeclarationArray",
	"cobweb/Prototype/ProtoDeclarationArray",
	"cobweb/Prototype/X3DExternProtoDeclaration",
	"cobweb/Prototype/X3DProtoDeclaration",
	"cobweb/Routing/RouteArray",
	"cobweb/Routing/X3DRoute",
	"cobweb/Browser/Scripting/evaluate",
	"cobweb/Components/Scripting/X3DScriptNode",
	"cobweb/InputOutput/Loader",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DField,
          X3DArrayField,
          Fields,
          X3DBrowser,
          X3DExecutionContext,
          X3DScene,
          ExternProtoDeclarationArray,
          ProtoDeclarationArray,
          X3DExternProtoDeclaration,
          X3DProtoDeclaration,
          RouteArray,
          X3DRoute,
          evaluate,
          X3DScriptNode, 
          Loader,
          X3DConstants)
{
	with (Fields)
	{
		var
			ECMAScript = /^\s*(?:vrmlscript|javascript|ecmascript)\:((?:.|[\r\n])*)$/,
			fieldDefinitions = [
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",     new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "url",          new MFString ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "directOutput", new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "mustEvaluate", new SFBool (false)),
			];
	
		function Script (executionContext)
		{
			this .fieldDefinitions = new FieldDefinitionArray (fieldDefinitions .slice (0));

			X3DScriptNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Script);

			this .setExtendedEventHandling (false);
		}

		Script .prototype = $.extend (Object .create (X3DScriptNode .prototype),
		{
			constructor: Script,
			getTypeName: function ()
			{
				return "Script";
			},
			getComponentName: function ()
			{
				return "Scripting";
			},
			getContainerField: function ()
			{
				return "children";
			},
			initialize: function ()
			{
				X3DScriptNode .prototype .initialize .call (this);

				setTimeout (this .requestImmediateLoad .bind (this), 0);
			},
			hasUserDefinedFields: function ()
			{
				return true;
			},
			getCDATA: function ()
			{
				return this .url_;
			},
			requestImmediateLoad: function ()
			{
				for (var i = 0, length = this .url_ .length; i < length; ++ i)
				{
					var
						URL    = this .url_ [i],
						result = ECMAScript .exec (URL);

					try
					{
						if (result)
						{
							this .initialize__ (result [1]);
							break;
						}
					}
					catch (error)
					{
						console .error (error .message);
					}
				}
			},
			getContext: function (text)
			{
				var
					callbacks         = ["initialize", "prepareEvents", "eventsProcessed", "shutdown"],
					userDefinedFields = this .getUserDefinedFields ();

				for (var name in userDefinedFields)
				{
					var field = userDefinedFields [name];

					switch (field .getAccessType ())
					{
						case X3DConstants .inputOnly:
							callbacks .push (field .getName ());
							break;
						case X3DConstants .inputOutput:
							callbacks .push ("set_" + field .getName ());
							break;
					}
				}

				text += "\n;var " + callbacks .join (",") + ";";
				text += "\n[" + callbacks .join (",") + "];"

				var
					global  = Object .create ({ }, this .getGlobal ()),
					result  = evaluate (global, text),
					context = { };

				for (var i = 0; i < callbacks .length; ++ i)
				{
					if (typeof result [i] === "function")
						context [callbacks [i]] = result [i];
					else
						context [callbacks [i]] = null;
				}

				return context;
			},
			getGlobal: function ()
			{
				var browser = this .getBrowser ();

				function SFNode (vrmlSyntax)
				{
					if (typeof vrmlSyntax === "string")
					{
						var scene = browser .createX3DFromString (vrmlSyntax);

						if (scene .getRootNodes () .length && scene .getRootNodes () [0])
							return Fields .SFNode .call (this, scene .getRootNodes () [0] .getValue ());
					}

					return Fields .SFNode .call (this);
				}

				SFNode .prototype = Fields .SFNode .prototype;

				var global =
				{
					NULL:  { value: null },
					FALSE: { value: false },
					TRUE:  { value: true },
					print: { value: function () { this .print .apply (this, arguments); } .bind (this .getBrowser ()) },
					trace: { value: function () { this .print .apply (this, arguments); } .bind (this .getBrowser ()) },

					Browser: { value: this .getBrowser () },

					X3DConstants:                { value: X3DConstants },
					X3DBrowser:                  { value: X3DBrowser },
					X3DExecutionContext:         { value: X3DExecutionContext },
					X3DScene:                    { value: X3DScene },
					ExternProtoDeclarationArray: { value: ExternProtoDeclarationArray },
					ProtoDeclarationArray:       { value: ProtoDeclarationArray },
					X3DExternProtoDeclaration:   { value: X3DExternProtoDeclaration },
					X3DProtoDeclaration:         { value: X3DProtoDeclaration },
					RouteArray:                  { value: RouteArray },
					X3DRoute:                    { value: X3DRoute },

					X3DFieldDefinition:   { value: X3DFieldDefinition },
					FieldDefinitionArray: { value: FieldDefinitionArray },

					X3DField:      { value: X3DField },
					X3DArrayField: { value: X3DArrayField },

					SFColor:       { value: SFColor },
					SFColorRGBA:   { value: SFColorRGBA },
					SFImage:       { value: SFImage },
					SFMatrix3d:    { value: SFMatrix3d },
					SFMatrix3f:    { value: SFMatrix3f },
					SFMatrix4d:    { value: SFMatrix4d },
					SFMatrix4f:    { value: SFMatrix4f },
					SFNode:        { value: SFNode },
					SFRotation:    { value: SFRotation },
					SFVec3d:       { value: SFVec2d },
					SFVec2f:       { value: SFVec2f },
					SFVec2d:       { value: SFVec3d },
					SFVec3f:       { value: SFVec3f },
					SFVec4d:       { value: SFVec4d },
					SFVec4f:       { value: SFVec4f },
					VrmlMatrix:    { value: VrmlMatrix },

					MFBool:        { value: MFBool },
					MFColor:       { value: MFColor },
					MFColorRGBA:   { value: MFColorRGBA },
					MFDouble:      { value: MFDouble },
					MFFloat:       { value: MFFloat },
					MFImage:       { value: MFImage },
					MFInt32:       { value: MFInt32 },
					MFMatrix3d:    { value: MFMatrix3d },
					MFMatrix3f:    { value: MFMatrix3f },
					MFMatrix4d:    { value: MFMatrix4d },
					MFMatrix4f:    { value: MFMatrix4f },
					MFNode:        { value: MFNode },
					MFRotation:    { value: MFRotation },
					MFString:      { value: MFString },
					MFTime:        { value: MFTime },
					MFVec2d:       { value: MFVec2d },
					MFVec2f:       { value: MFVec2f },
					MFVec3d:       { value: MFVec3d },
					MFVec3f:       { value: MFVec3f },
					MFVec4d:       { value: MFVec4d },
					MFVec4f:       { value: MFVec4f },
				};

				var userDefinedFields = this .getUserDefinedFields ();

				for (var name in userDefinedFields)
				{
					var field = userDefinedFields [name];

					if (field .getAccessType () === X3DConstants .inputOnly)
						continue;

					if (! (name in global))
					{
						global [name] =
						{
							get: field .valueOf .bind (field),
							set: field .setValue .bind (field),
						};
					}

					if (field .getAccessType () === X3DConstants .inputOutput)
					{
						global [name + "_changed"] =
						{
							get: field .valueOf .bind (field),
							set: field .setValue .bind (field),
						};
					}
				}

				return global;
			},
			set_live__: function ()
			{
				var userDefinedFields = this .getUserDefinedFields ();

				if (this .getExecutionContext () .isLive_ .getValue () && this .isLive_ .getValue ())
				{
					if (this .context .prepareEvents)
						this .getBrowser () .prepareEvents () .addInterest (this, "prepareEvents__");

					if (this .context .eventsProcessed)
						this .addInterest (this, "eventsProcessed__");

					for (var name in userDefinedFields)
					{
						var field = userDefinedFields [name];
						
						switch (field .getAccessType ())
						{
							case X3DConstants .inputOnly:
							{
								if (this .context [field .getName ()])
									field .addInterest (this, "set_field__", field .getName ());
								break;
							}
							case X3DConstants .inputOutput:
							{
								var callback = "set_" + field .getName ();
	
								if (this .context [callback])
									field .addInterest (this, "set_field__", callback);
								break;
							}
						}
					}
				}
				else
				{
					if (this .context .prepareEvents)
						this .getBrowser () .prepareEvents () .removeInterest (this, "prepareEvents__");

					if (this .context .eventsProcessed)
						this .removeInterest (this, "eventsProcessed__");

					for (var name in userDefinedFields)
					{
						var field = userDefinedFields [name];
						
						switch (field .getAccessType ())
						{
							case X3DConstants .inputOnly:
							{
								field .removeInterest (this, "set_field__");
								break;
							}
							case X3DConstants .inputOutput:
							{
								field .removeInterest (this, "set_field__");
								break;
							}
						}
					}
				}
			},
			initialize__: function (text)
			{
				this .context = this .getContext (text);

				this .getExecutionContext () .isLive_ .addInterest (this, "set_live__");
				this .isLive_ .addInterest (this, "set_live__");

				this .set_live__ ();

				try
				{
					if (this .context .initialize)
					{
						this .getBrowser () .getScriptStack () .push (this);
						this .context .initialize ();
						this .getBrowser () .getScriptStack () .pop ();
					}
				}
				catch (error)
				{
					this .setError ("initialize", error);
				}
			},
			prepareEvents__: function ()
			{
				try
				{
					this .getBrowser () .getScriptStack () .push (this);
					this .context .prepareEvents ();
					this .getBrowser () .getScriptStack () .pop ();
				}
				catch (error)
				{
					this .setError ("prepareEvents", error);
				}
			},
			set_field__: function (field, callback)
			{
				field .setTainted (true);

				try
				{
					this .getBrowser () .getScriptStack () .push (this);
					this .context [callback] (field .valueOf (), this .getBrowser () .getCurrentTime ());
					this .getBrowser () .getScriptStack () .pop ();
				}
				catch (error)
				{
					this .setError (callback, error);
				}

				field .setTainted (false);
			},
			eventsProcessed__: function ()
			{
				try
				{
					this .getBrowser () .getScriptStack () .push (this);
					this .context .eventsProcessed ();
					this .getBrowser () .getScriptStack () .pop ();
				}
				catch (error)
				{
					this .setError ("eventsProcessed", error);
				}
			},
			shutdown__: function ()
			{
				try
				{
					this .getBrowser () .getScriptStack () .push (this);
					this .context .shutdown ();
					this .getBrowser () .getScriptStack () .pop ();
				}
				catch (error)
				{
					this .setError ("shutdown", error);
				}
			},
			setError: function (callback, error)
			{
				console .error (new Error ("JavaScript Error in '" + callback + "': " + error .message));
			},
		});

		return Script;
	}
});

