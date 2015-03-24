
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Parser/Parser",
	"cobweb/Bits/X3DConstants",
],
function ($, Fields, Parser, X3DConstants)
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
			this .xml              = xml;
			this .executionContext = [ scene ];
			this .nodes            = [ ];
			this .parser           = new Parser (this .scene, "", true);
		}

		XMLParser .prototype =
		{
			constructor: XMLParser,
			getExecutionContext: function ()
			{
				return this .executionContext [this .executionContext .length - 1];
			},
			parseIntoScene: function ()
			{
				var t0 = performance .now ();

				switch (this .xml .nodeName)
				{
					case "#document":
					{
						var x3d = $(this .xml) .children ("X3D");
	
						for (var i = 0; i < x3d .length; ++ i)
							this .x3d (x3d [i]);

						break;
					}
					case "X3D":
						this .x3d (this .xml);
						break;

					case "Scene":
					case "SCENE":
						this .scene (this .xml);
						break;

					default:
						this .child (this .xml);
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
						case "SCENE":
							this .scene (element);
							return;
					}
				}
			},
			scene: function (element)
			{
				this .children (element .childNodes);
			},
			children: function (childNodes)
			{
				for (var i = 0; i < childNodes .length; ++ i)
					this .child (childNodes [i]);	
			},
			child: function (element)
			{
				switch (element .nodeName)
				{
					case "#text":
						return;

					case "#cdata-section":
						this .cdata (element);
						return;

					case "field":
						this .field (element);
						return;

					case "ROUTE":
						this .route (element);
						return;

					default:
						this .node (element);
						return;
				}
			},
			node: function (element)
			{
				try
				{
					if (this .USE (element))
						return;
				
					var node = this .getExecutionContext () .createNode (element .nodeName, false);
					
					this .DEF (element, node);
					this .addNode (element, node);
					this .nodes .push (node);
					this .attributes (element .attributes, node);
					this .children (element .childNodes);
					this .getExecutionContext () .addUninitializedNode (node);
					this .nodes .pop ();
				}
				catch (error)
				{
					if (element .nodeName === "VisibilitySensor")
						console .log (error);

					console .warn ("Unknown node type '" + element .nodeName + "'.");
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
				{ }
			},
			USE: function (element)
			{
				try
				{
					var name = element .getAttribute ("USE");

					if (name)
					{
						var node = this .getExecutionContext () .getNamedNode (name);

						this .addNode (element, node .getValue ());
						return true;
					}
				}
				catch (error)
				{
					//console .log (error .message);
				}

				return false;
			},
			addNode: function (element, node)
			{
				if (this .nodes .length)
				{
					try
					{
						var containerField = element .getAttribute ("containerField");

						if (containerField)
						{
							var field = this .nodes [this .nodes .length - 1] .getField (containerField);

							if (field .getType () === X3DConstants .SFNode)
								return field .setValue (node);

							if (field .getType () === X3DConstants .MFNode)
								return field .push (node);
						}
					}
					catch (error)
					{
						//console .log (error .message);
					}

					try
					{
						var field = this .nodes [this .nodes .length - 1] .getField (node .getContainerField ());

						if (field .getType () === X3DConstants .SFNode)
							return field .setValue (node);

						if (field .getType () === X3DConstants .MFNode)
							return field .push (node);
					}
					catch (error)
					{
						//console .log (error .message);
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
				{ }
			},
			cdata: function (element)
			{
				var
					node  = this .nodes [this .nodes .length - 1]
					field = node .getCDATA ();

				if (field)
					field .push (element .data);
			},
			field: function (element)
			{
				var node = this .nodes [this .nodes .length - 1];

				if (! node .hasUserDefinedFields ())
					return;

				var accessType = AccessType [element .getAttribute ("accessType")];

				if (accessType === undefined)
					return;

				var type = Fields [element .getAttribute ("type")];

				if (type === undefined)
					return;

				var name = element .getAttribute ("name");

				if (! name)
					return;

				var field = new type ();

				if (accessType & X3DConstants .initializeOnly)
				{
					var value = element .getAttribute ("value");

					if (value !== null)
					{
						try
						{
							this .parser .setInput (value);
							this .fieldTypes [field .getType ()] .call (this .parser, field);
						}
						catch (error)
						{ }
					}
				}

				node .addUserDefinedField (accessType, name, field);
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
					var sourceNode      = this .getExecutionContext () .getNamedNode (fromNode);
					var destinationNode = this .getExecutionContext () .getNamedNode (toNode);

					this .getExecutionContext () .addRoute (sourceNode, fromField, destinationNode, toField);
				}
				catch (error)
				{
					console .log (error .message);
				}
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
