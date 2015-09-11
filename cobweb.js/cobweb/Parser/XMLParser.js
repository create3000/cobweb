
define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Basic/X3DArrayField",
	"cobweb/Fields",
	"cobweb/Parser/Parser",
	"cobweb/Prototype/X3DExternProtoDeclaration",
	"cobweb/Prototype/X3DProtoDeclaration",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DField,
          X3DArrayField,
          Fields,
          Parser,
          X3DExternProtoDeclaration,
          X3DProtoDeclaration,
          X3DConstants)
{
	with (Fields)
	{
		var AccessType =
		{
			initializeOnly: X3DConstants .initializeOnly,
			inputOnly:      X3DConstants .inputOnly,
			outputOnly:     X3DConstants .outputOnly,
			inputOutput:    X3DConstants .inputOutput,
		};
	
		function XMLParser (scene, xml)
		{
			this .xml               = xml;
			this .executionContexts = [ scene ];
			this .protoDeclarations = [ ];
			this .parents           = [ ];
			this .parser            = new Parser (this .scene, "", true);
			this .url               = new MFString ();
		}

		XMLParser .prototype =
		{
			constructor: XMLParser,
			getExecutionContext: function ()
			{
				return this .executionContexts [this .executionContexts .length - 1];
			},
			pushExecutionContext: function (executionContext)
			{
				return this .executionContexts .push (executionContext);
			},
			popExecutionContext: function ()
			{
				this .executionContexts .pop ();
			},
			getParent: function ()
			{
				return this .parents [this .parents .length - 1];
			},
			pushParent: function (parent)
			{
				return this .parents .push (parent);
			},
			popParent: function ()
			{
				this .parents .pop ();
			},
			parseIntoScene: function ()
			{
				var t0 = performance .now ();

				switch (this .xml .nodeName)
				{
					case "#document":
					{
						var x3d = $(this .xml) .children ("X3D");
	
						if (x3d .length)
						{
							for (var i = 0; i < x3d .length; ++ i)
								this .x3d (x3d [i]);
						}
						else
							this .scene (this .xml);

						break;
					}
					case "X3D":
						this .x3d (this .xml);
						break;
					case "Scene":
						this .scene (this .xml);
						break;
					default:
						this .statement (this .xml);
						break;
				}

				//console .log ("'" + this .getExecutionContext () .getWorldURL () .toString () + "' parsed in " + (performance .now () - t0) .toFixed (2) + " ms.");
			},
			x3d: function (x3d)
			{
				var childNodes = x3d .childNodes;
		
				for (var i = 0; i < childNodes .length; ++ i)
				{
					var element = childNodes [i];
				
					switch (element .nodeName)
					{
						case "Scene":
							this .scene (element);
							continue;
					}
				}
			},
			scene: function (element)
			{
				this .statements (element .childNodes);
			},
			statements: function (childNodes)
			{
				for (var i = 0; i < childNodes .length; ++ i)
					this .statement (childNodes [i]);
			},
			statement: function (child)
			{
				switch (child .nodeName)
				{
					case "#comment":
					case "#text":
					case "#cdata-section":
						return;
					
					case "ExternProtoDeclare":
						this .externProtoDeclare (child);
						return;

					case "ProtoDeclare":
						this .protoDeclare (child);
						return;

					case "ProtoInstance":
						this .protoInstance (child);
						return;

					case "ROUTE":
						this .route (child);
						return;

					default:
						this .node (child);
						return;
				}
			},
			node: function (element)
			{
				try
				{
					if (this .USE (element))
						return;
				
					var node = this .getExecutionContext () .createNode (element .nodeName, true);

					this .DEF (element, node);
					this .addNode (element, node);
					this .pushParent (node);
					this .attributes (element .attributes, node);
					this .children (element .childNodes, false);
					this .getExecutionContext () .addUninitializedNode (node);
					this .popParent ();
				}
				catch (error)
				{
					//if (element .nodeName === "VisibilitySensor")
					//	console .warn (error);

					console .warn ("XML Parser Error: Unknown node type '" + element .nodeName + "'.");
				}
			},
			protoInstance: function (element)
			{
				try
				{
					if (this .USE (element))
						return;

					var name = element .getAttribute ("name");

					if (this .id (name))
					{
						var node = this .getExecutionContext () .createProto (name, false);

						this .DEF (element, node);
						this .addNode (element, node);
						this .pushParent (node);
						this .children (element .childNodes, true);
						this .getExecutionContext () .addUninitializedNode (node);
						this .popParent ();
					}
				}
				catch (error)
				{
					console .warn ("XML Parser Error: ", + error .message);
					//console .warn (error);
				}
			},
			children: function (childNodes, protoInstance)
			{
				for (var i = 0; i < childNodes .length; ++ i)
					this .child (childNodes [i], protoInstance);
			},
			child: function (child, protoInstance)
			{
				switch (child .nodeName)
				{
					case "#comment":
					case "#text":
						return;

					case "#cdata-section":
						this .cdata (child);
						return;
					
					case "IS":
						this .IS (child);
						return;

					case "field":
						this .field (child);
						return;

					case "fieldValue":
						if (protoInstance)
							this .fieldValue (child);
						return;
							
					case "ExternProtoDeclare":
						this .externProtoDeclare (child);
						return;

					case "ProtoDeclare":
						this .protoDeclare (child);
						return;

					case "ProtoInstance":
						this .protoInstance (child);
						return;

					case "ROUTE":
						this .route (child);
						return;

					default:
						this .node (child);
						return;
				}
			},
			DEF: function (element, node)
			{
				try
				{
					var name = element .getAttribute ("DEF");

					if (name)
						this .getExecutionContext () .updateNamedNode (name, node);
				}
				catch (error)
				{
					console .warn ("Invalid DEF name: " + error .message);
				}
			},
			USE: function (element)
			{
				try
				{
					var name = element .getAttribute ("USE");

					if (this .id (name))
					{
						var node = this .getExecutionContext () .getNamedNode (name);

						this .addNode (element, node .getValue ());
						return true;
					}
				}
				catch (error)
				{
					console .warn ("Invalid USE name: " + error .message);
				}

				return false;
			},
			addNode: function (element, node)
			{
				if (this .parents .length)
				{
					var parent = this .getParent ();

					if (parent instanceof X3DField)
					{
						if (parent .getFieldValue () === false)
							parent .setFieldValue (true);

						if (parent .getType () === X3DConstants .SFNode)
							parent .set (node);

						if (parent .getType () === X3DConstants .MFNode)
							parent .push (node);
					}
					else
					{
						// parent is a node.

						try
						{
							var containerField = element .getAttribute ("containerField");

							if (containerField)
							{
								var field = parent .getField (containerField);

								if (field .getType () === X3DConstants .SFNode)
									return field .set (node);

								if (field .getType () === X3DConstants .MFNode)
									return field .push (node);
							}
						}
						catch (error)
						{
							//console .warn (error .message);
						}

						try
						{
							// containerField attribute is not set or not found in node.

							var field = parent .getField (node .getContainerField ());

							if (field .getType () === X3DConstants .SFNode)
								return field .set (node);

							if (field .getType () === X3DConstants .MFNode)
								return field .push (node);
						}
						catch (error)
						{
							//console .warn (error .message);
						}
					}
				}
				else
					this .getExecutionContext () .rootNodes .push (node);
			},
			attributes: function (attributes, node)
			{
				for (var i = 0; i < attributes .length; ++ i)
					this .attribute (attributes [i], node);
			},
			attribute: function (attribute, node)
			{
				try
				{
					var
						name      = attribute .name,
						value     = attribute .value,
						field     = node .getField (name),
						fieldType = this .fieldTypes [field .getType ()];

					this .parser .setInput (value);
					fieldType .call (this .parser, field);
				}
				catch (error)
				{
					//console .warn (error .message);
				}
			},
			cdata: function (element)
			{
				var
					node  = this .getParent (),
					field = node .getCDATA ();

				if (field)
					field .push (element .data);
			},
			field: function (element)
			{
				var node = this .getParent ();

				if (! node .hasUserDefinedFields ())
					return;

				var accessType = AccessType [element .getAttribute ("accessType")];

				if (accessType === undefined)
					accessType = X3DConstants .initializeOnly;

				var type = Fields [element .getAttribute ("type")];

				if (type === undefined)
					return;

				var name = element .getAttribute ("name");

				if (! this .id (name))
					return;

				var field = new type ();

				if (accessType & X3DConstants .initializeOnly)
				{
					var value = element .getAttribute ("value");

					if (value !== null)
					{
						this .parser .setInput (value);
						this .fieldTypes [field .getType ()] .call (this .parser, field);
					}

					this .pushParent (field);
					this .statements (element .childNodes);
					this .popParent ();
				}

				node .addUserDefinedField (accessType, name, field);
			},
			fieldValue: function (element)
			{
				try
				{
					var
						node = this .getParent (),
						name = element .getAttribute ("name");

					if (! this .id (name))
						return;

					var
						field      = node .getField (name),
						accessType = field .getAccessType ();

					if (accessType & X3DConstants .initializeOnly)
					{
						var value = element .getAttribute ("value");

						if (value !== null)
						{
							this .parser .setInput (value);
							this .fieldTypes [field .getType ()] .call (this .parser, field);
							field .setFieldValue (true);
						}
						else
							field .setFieldValue (false);

						this .pushParent (field);
						this .statements (element .childNodes);
						this .popParent ();
					}
				}
				catch (error)
				{
					console .warn ("XML Parser Error: Couldn't assign field value: " + error .message);
				}
			},
			IS: function (element)
			{
				if (this .getExecutionContext () instanceof X3DProtoDeclaration)
				{
					var childNodes = element .childNodes;

					for (var i = 0; i < childNodes .length; ++ i)
					{
						var child = childNodes [i];

						switch (child .nodeName)
						{
							case "CONNECT":
							case "connect":
								this .connect (child);
								continue;
						}
					}
				}
			},
			connect: function (element)
			{
				var
					nodeFieldName  = element .getAttribute ("nodeField"),
					protoFieldName = element .getAttribute ("protoField");

				if (! nodeFieldName || ! protoFieldName)
					return;

				try
				{
					var
						node       = this .getParent (),
						proto      = this .getExecutionContext (),
						nodeField  = node .getField (nodeFieldName),
						protoField = proto .getField (protoFieldName);

					if (nodeField .getAccessType () === protoField .getAccessType () || nodeField .getAccessType () === X3DConstants .inputOutput)
					{
						if (nodeField .getType () === protoField .getType ())
							nodeField .addReference (protoField);
						else
							throw new Error ("Field types do not match.");
					}
					else
						throw new Error ("Field access types do not match.");
				}
				catch (error)
				{
					console .warn ("Couldn't create IS reference: " + error .message);
				}
			},
			externProtoDeclare: function (element)
			{
				var name = element .getAttribute ("name");

				if (this .id (name))
				{
					var url = element .getAttribute ("url");
					
					if (url !== null)
					{
						this .parser .setInput (url);
						Parser .prototype .mfstringValues .call (this .parser, this .url);
					}
					else
						this .url .length = 0;

					var externproto = new X3DExternProtoDeclaration (this .getExecutionContext ());
								
					this .pushParent (externproto);
					this .protoInterface (element); // parse fields
					this .popParent ();

					externproto .setName (name);
					externproto .url_ = this .url;
					externproto .setup ();

					this .getExecutionContext () .externprotos .push (externproto);	
				}
			},
			protoDeclare: function (element)
			{
				var name = element .getAttribute ("name");

				if (this .id (name))
				{
					var
						proto      = new X3DProtoDeclaration (this .getExecutionContext ()),
						childNodes = element .childNodes;

					for (var i = 0; i < childNodes .length; ++ i)
					{
						var child = childNodes [i];

						switch (child .nodeName)
						{
							case "ProtoInterface":
								this .pushParent (proto);
								this .protoInterface (child);
								this .popParent ();
								continue;
							case "ProtoBody":
								this .pushExecutionContext (proto);
								this .protoBody (child);
								this .popExecutionContext ();
								continue;
						}
					}

					proto .setName (name);
					proto .setup ();

					this .getExecutionContext () .protos .push (proto);
				}
			},
			protoInterface: function (element)
			{
				var childNodes = element .childNodes;

				for (var i = 0; i < childNodes .length; ++ i)
				{
					var child = childNodes [i];

					switch (child .nodeName)
					{
						case "FIELD": // User-defined field
						case "field": // User-defined field
							this .field (child);
							continue;
					}
				}
			},
			protoBody: function (element)
			{
				this .statements (element .childNodes);
			},
			route: function (element)
			{
				var
					fromNode  = element .getAttribute ("fromNode"),
					fromField = element .getAttribute ("fromField"),
					toNode    = element .getAttribute ("toNode"),
					toField   = element .getAttribute ("toField");

				try
				{
					var
						sourceNode      = this .getExecutionContext () .getNamedNode (fromNode),
						destinationNode = this .getExecutionContext () .getNamedNode (toNode);

					this .getExecutionContext () .addRoute (sourceNode, fromField, destinationNode, toField);
				}
				catch (error)
				{
					console .warn ("XML Parser Error: " + error .message);
				}
			},
			id: function (string)
			{
				if (string)
				{
					// Test for id characters.
					return true;
				}

				return false;
			},
		};

		XMLParser .prototype .fieldTypes = [ ];
		XMLParser .prototype .fieldTypes [X3DConstants .SFBool]      = Parser .prototype .sfboolValue;
		XMLParser .prototype .fieldTypes [X3DConstants .SFColor]     = Parser .prototype .sfcolorValue;
		XMLParser .prototype .fieldTypes [X3DConstants .SFColorRGBA] = Parser .prototype .sfcolorrgbaValue;
		XMLParser .prototype .fieldTypes [X3DConstants .SFDouble]    = Parser .prototype .sfdoubleValue;
		XMLParser .prototype .fieldTypes [X3DConstants .SFFloat]     = Parser .prototype .sffloatValue;
		XMLParser .prototype .fieldTypes [X3DConstants .SFImage]     = Parser .prototype .sfimageValue;
		XMLParser .prototype .fieldTypes [X3DConstants .SFInt32]     = Parser .prototype .sfint32Value;
		XMLParser .prototype .fieldTypes [X3DConstants .SFMatrix3f]  = Parser .prototype .sfmatrix4dValue;
		XMLParser .prototype .fieldTypes [X3DConstants .SFMatrix3d]  = Parser .prototype .sfmatrix4fValue;
		XMLParser .prototype .fieldTypes [X3DConstants .SFMatrix4f]  = Parser .prototype .sfmatrix4dValue;
		XMLParser .prototype .fieldTypes [X3DConstants .SFMatrix4d]  = Parser .prototype .sfmatrix4fValue;
		XMLParser .prototype .fieldTypes [X3DConstants .SFNode]      = function (field) { field .set (null); };
		XMLParser .prototype .fieldTypes [X3DConstants .SFRotation]  = Parser .prototype .sfrotationValue;
		XMLParser .prototype .fieldTypes [X3DConstants .SFString]    = function (field) { field .set (this .input); };
		XMLParser .prototype .fieldTypes [X3DConstants .SFTime]      = Parser .prototype .sftimeValue;
		XMLParser .prototype .fieldTypes [X3DConstants .SFVec2d]     = Parser .prototype .sfvec2dValue;
		XMLParser .prototype .fieldTypes [X3DConstants .SFVec2f]     = Parser .prototype .sfvec2fValue;
		XMLParser .prototype .fieldTypes [X3DConstants .SFVec3d]     = Parser .prototype .sfvec3dValue;
		XMLParser .prototype .fieldTypes [X3DConstants .SFVec3f]     = Parser .prototype .sfvec3fValue;
		XMLParser .prototype .fieldTypes [X3DConstants .SFVec4d]     = Parser .prototype .sfvec4dValue;
		XMLParser .prototype .fieldTypes [X3DConstants .SFVec4f]     = Parser .prototype .sfvec4fValue;

		XMLParser .prototype .fieldTypes [X3DConstants .MFBool]      = Parser .prototype .mfboolValues;
		XMLParser .prototype .fieldTypes [X3DConstants .MFColor]     = Parser .prototype .mfcolorValues;
		XMLParser .prototype .fieldTypes [X3DConstants .MFColorRGBA] = Parser .prototype .mfcolorrgbaValues;
		XMLParser .prototype .fieldTypes [X3DConstants .MFDouble]    = Parser .prototype .mfdoubleValues;
		XMLParser .prototype .fieldTypes [X3DConstants .MFFloat]     = Parser .prototype .mffloatValues;
		XMLParser .prototype .fieldTypes [X3DConstants .MFImage]     = Parser .prototype .mfimageValues;
		XMLParser .prototype .fieldTypes [X3DConstants .MFInt32]     = Parser .prototype .mfint32Values;
		XMLParser .prototype .fieldTypes [X3DConstants .MFMatrix3d]  = Parser .prototype .mfmatrix3dValues;
		XMLParser .prototype .fieldTypes [X3DConstants .MFMatrix3f]  = Parser .prototype .mfmatrix3fValues;
		XMLParser .prototype .fieldTypes [X3DConstants .MFMatrix4d]  = Parser .prototype .mfmatrix4dValues;
		XMLParser .prototype .fieldTypes [X3DConstants .MFMatrix4f]  = Parser .prototype .mfmatrix4fValues;
		XMLParser .prototype .fieldTypes [X3DConstants .MFNode]      = function () { };
		XMLParser .prototype .fieldTypes [X3DConstants .MFRotation]  = Parser .prototype .mfrotationValues;
		XMLParser .prototype .fieldTypes [X3DConstants .MFString]    = Parser .prototype .mfstringValues;
		XMLParser .prototype .fieldTypes [X3DConstants .MFTime]      = Parser .prototype .mftimeValues;
		XMLParser .prototype .fieldTypes [X3DConstants .MFVec2d]     = Parser .prototype .mfvec2dValues;
		XMLParser .prototype .fieldTypes [X3DConstants .MFVec2f]     = Parser .prototype .mfvec2fValues;
		XMLParser .prototype .fieldTypes [X3DConstants .MFVec3d]     = Parser .prototype .mfvec3dValues;
		XMLParser .prototype .fieldTypes [X3DConstants .MFVec3f]     = Parser .prototype .mfvec3fValues;
		XMLParser .prototype .fieldTypes [X3DConstants .MFVec4d]     = Parser .prototype .mfvec4dValues;
		XMLParser .prototype .fieldTypes [X3DConstants .MFVec4f]     = Parser .prototype .mfvec4fValues;

		return XMLParser;
	}
});
