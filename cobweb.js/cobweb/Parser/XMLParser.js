/* -*- Mode: JavaScript; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
 *******************************************************************************
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright create3000, Scheffelstraße 31a, Leipzig, Germany 2011.
 *
 * All rights reserved. Holger Seelig <holger.seelig@yahoo.de>.
 *
 * The copyright notice above does not evidence any actual of intended
 * publication of such source code, and is an unpublished work by create3000.
 * This material contains CONFIDENTIAL INFORMATION that is the property of
 * create3000.
 *
 * No permission is granted to copy, distribute, or create derivative works from
 * the contents of this software, in whole or in part, without the prior written
 * permission of create3000.
 *
 * NON-MILITARY USE ONLY
 *
 * All create3000 software are effectively free software with a non-military use
 * restriction. It is free. Well commented source is provided. You may reuse the
 * source in any way you please with the exception anything that uses it must be
 * marked to indicate is contains 'non-military use only' components.
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright 2015, 2016 Holger Seelig <holger.seelig@yahoo.de>.
 *
 * This file is part of the Cobweb Project.
 *
 * Cobweb is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License version 3 only, as published by the
 * Free Software Foundation.
 *
 * Cobweb is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License version 3 for more
 * details (a copy is included in the LICENSE file that accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version 3
 * along with Cobweb.  If not, see <http://www.gnu.org/licenses/gpl.html> for a
 * copy of the GPLv3 License.
 *
 * For Silvio, Joy and Adi.
 *
 ******************************************************************************/


define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Basic/X3DArrayField",
	"cobweb/Fields",
	"cobweb/Parser/Parser",
	"cobweb/Parser/HTMLSupport",
	"cobweb/Prototype/X3DExternProtoDeclaration",
	"cobweb/Prototype/X3DProtoDeclaration",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DField,
          X3DArrayField,
          Fields,
          Parser,
	  HTMLSupport,   
          X3DExternProtoDeclaration,
          X3DProtoDeclaration,
          X3DConstants)
{
"use strict";

	var AccessType =
	{
		initializeOnly: X3DConstants .initializeOnly,
		inputOnly:      X3DConstants .inputOnly,
		outputOnly:     X3DConstants .outputOnly,
		inputOutput:    X3DConstants .inputOutput,
	};

	function XMLParser (scene)
	{
		this .scene             = scene;
		this .executionContexts = [ scene ];
		this .protoDeclarations = [ ];
		this .parents           = [ ];
		this .parser            = new Parser (this .scene, true);
		this .url               = new Fields .MFString ();
	}

	XMLParser .prototype =
	{
		constructor: XMLParser,
		getBrowser: function ()
		{
			return this .scene .getBrowser ();
		},
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
		parseIntoNode: function (node, xml)
		{
			this .pushExecutionContext (node .getExecutionContext ());
			this .pushParent (node);

			this .statement (xml);

			this .popParent ();
			this .popExecutionContext ();
		},
		parseIntoScene: function (xml)
		{
			switch (xml .nodeName)
			{
				case "#document":
				{
					var X3D = $(xml) .children ("X3D");

					if (X3D .length)
					{
						for (var i = 0; i < X3D .length; ++ i)
							this .X3D (X3D [i]);
					}
					else
						this .Scene (xml);

					break;
				}
				case "X3D":
					this .X3D (xml);
					break;
				case "Scene":
				case "SCENE":
					this .Scene (xml);
					break;
				default:
					this .statement (xml);
					break;
			}
		},
		X3D: function (element)
		{
			this .profile (element);

			var specificationVersion = element .getAttribute ("version");

			if (specificationVersion)
				this .scene .specificationVersion = specificationVersion;

			this .scene .encoding = "XML";

			// Process child nodes

			var childNodes = element .childNodes;
	
			for (var i = 0; i < childNodes .length; ++ i)
			{
				var element = childNodes [i];
			
				switch (element .nodeName)
				{
					case "head":
					case "HEAD":
						this .head (element);
						continue;
					case "Scene":
					case "SCENE":
						this .Scene (element);
						continue;
				}
			}
		},
		profile: function (element)
		{
			try
			{
				var
					profileNameId = element .getAttribute ("profile"),
					profile       = this .getBrowser () .getProfile (profileNameId || "Full");

				this .scene .setProfile (profile);
			}
			catch (error)
			{
				console .log (error);
			}
		},
		head: function (element)
		{
			var childNodes = element .childNodes;
	
			for (var i = 0; i < childNodes .length; ++ i)
			{
				var element = childNodes [i];
			
				switch (element .nodeName)
				{
					case "component":
					case "COMPONENT":
						this .component (element);
						continue;
					case "unit":
					case "UNIT":
						this .unit (element);
						continue;
					case "meta":
					case "META":
						this .meta (element);
						continue;
				}
			}
		},
		component: function (element)
		{
			try
			{
				var
					componentNameIdCharacters = element .getAttribute ("name"),
					componentSupportLevel = parseInt (element .getAttribute ("level"));
	
				if (componentNameIdCharacters == null)
					return console .warn ("XML Parser Error: Bad component statement: Expected name attribute.");
	
				if (componentSupportLevel == null)
					return console .warn ("XML Parser Error: Bad component statement: Expected level attribute.");

				var component = this .getBrowser () .getComponent (componentNameIdCharacters, componentSupportLevel);
	
				this .scene .addComponent (component);
			}
			catch (error)
			{
				console .log (error .message);
			}
		},
		unit: function (element)
		{
			var
				category         = element .getAttribute ("category"),
				name             = element .getAttribute ("name"),
				conversionFactor = element .getAttribute ("conversionFactor"); //works for html5 as well

			if (category == null)
				return console .warn ("XML Parser Error: Bad unit statement: Expected category attribute.");

			if (name == null)
				return console .warn ("XML Parser Error: Bad unit statement: Expected name attribute.");

			if (conversionFactor == null)
				return console .warn ("XML Parser Error: Bad unit statement: Expected conversionFactor attribute.");

			this .scene .updateUnit (category, name, parseFloat (conversionFactor));
		},
		meta: function (element)
		{
			var
				metakey   = element .getAttribute ("name"),
				metavalue = element .getAttribute ("content");

			if (metakey == null)
				return console .warn ("XML Parser Error: Bad meta statement: Expected name attribute.");	

			if (metavalue === null)
				return console .warn ("XML Parser Error: Bad meta statement: Expected content attribute.");

			this .scene .setMetaData (metakey, metavalue);
		},
		Scene: function (element)
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
				case "EXTERNPROTODECLARE":
					this .ExternProtoDeclare (child);
					return;

				case "ProtoDeclare":
				case "PROTODECLARE":
					this .ProtoDeclare (child);
					return;

				case "ProtoInstance":
				case "PROTOINSTANCE":
					this .ProtoInstance (child);
					return;

				case "IMPORT":
					this .IMPORT (child);
					return;

				case "ROUTE":
					this .ROUTE (child);
					return;

				case "EXPORT":
					this .EXPORT (child);
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

				var node = this .getExecutionContext () .createNode (element .nodeName, false);

				//AP: attach node to DOM element for access from DOM.
            element .x3d = node;

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
				//console .error (error);

				console .error ("XML Parser Error: " + error .message);
			}
		},
		ProtoInstance: function (element)
		{
			try
			{
				if (this .USE (element))
					return;

				var name = element .getAttribute ("name");

				if (this .id (name))
				{
					var node = this .getExecutionContext () .createProto (name, false);

					//AP: attach node to DOM element for access from DOM.
					element .x3d = node;

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
				console .warn ("XML Parser Error: ", error .message);
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
				case "FIELD":
					this .field (child);
					return;

				case "fieldValue":
				case "FIELDVALUE":
					if (protoInstance)
						this .fieldValue (child);
					return;
						
				case "ExternProtoDeclare":
				case "EXTERNPROTODECLARE":
					this .ExternProtoDeclare (child);
					return;

				case "ProtoDeclare":
				case "PROTODECLARE":
					this .ProtoDeclare (child);
					return;

				case "ProtoInstance":
				case "PROTOINSTANCE":
					this .ProtoInstance (child);
					return;

				case "IMPORT":
					this .IMPORT (child);
					return;

				case "ROUTE":
					this .ROUTE (child);
					return;

				case "EXPORT":
					this .EXPORT (child);
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
					switch (parent .getType ())
					{
						case X3DConstants .SFNode:
							parent .setValue (node);
							parent .setSet (true);
							return;

						case X3DConstants .MFNode:
							parent .push (node);
							parent .setSet (true);
							return;
					}
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

							switch (field .getType ())
							{
								case X3DConstants .SFNode:
									field .setValue (node);
									field .setSet (true);
									return;

								case X3DConstants .MFNode:
									field .push (node);
									field .setSet (true);
									return;
							}
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

						switch (field .getType ())
						{
							case X3DConstants .SFNode:
								field .setValue (node);
								field .setSet (true);
								return;

							case X3DConstants .MFNode:
								field .push (node);
								field .setSet (true);
								return;
						}
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
					field     = node .getField (this .attributeToCamelCase (name)),
					fieldType = this .fieldTypes [field .getType ()];

				this .parser .setInput (value);
				fieldType .call (this .parser, field);
				field .setSet (true);
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
			{
				field .push (element .data);
				field .setSet (true);
			}
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

				if (field instanceof X3DArrayField)
					field .length = 0;

				if (value !== null)
				{
					this .parser .setInput (value);
					this .fieldTypes [field .getType ()] .call (this .parser, field);
					field .setSet (true);
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

					if (field instanceof X3DArrayField)
						field .length = 0;

					if (value !== null)
					{
						this .parser .setInput (value);
						this .fieldTypes [field .getType ()] .call (this .parser, field);
						field .setSet (true);
					}

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

			if (nodeFieldName === null)
				return console .warn ("XML Parser Error: Bad connect statement: Expected nodeField attribute.");

			if (protoFieldName === null)
				return console .warn ("XML Parser Error: Bad connect statement: Expected protoField attribute.");

			try
			{
				var
					node      = this .getParent (),
					proto     = this .getExecutionContext (),
					field     = node .getField (nodeFieldName),
					reference = proto .getField (protoFieldName);

				if (field .getType () === reference .getType ())
				{
					if (reference .isReference (field .getAccessType ()))
						field .addReference (reference);
					else
						throw new Error ("Field '" + field .getName () + "' and '" + reference .getName () + "' in PROTO " + this .getExecutionContext () . getName () + " are incompatible as an IS mapping.");
				}
				else
					throw new Error ("Field '" + field .getName () + "' and '" + reference .getName () + "' in PROTO " + this .getExecutionContext () .getName () + " have different types.");
			}
			catch (error)
			{
				console .warn ("XML Parser Error: Couldn't create IS reference: " + error .message);
			}
		},
		ExternProtoDeclare: function (element)
		{
			var name = element .getAttribute ("name");

			if (this .id (name))
			{
				var url = element .getAttribute ("url");

				if (url === null)
					return console .warn ("XML Parser Error: Bad ExternProtoDeclare statement: Expected url attribute.");
				
				if (url !== null)
				{
					this .parser .setInput (url);
					Parser .prototype .sfstringValues .call (this .parser, this .url);
				}
				else
					this .url .length = 0;

				var externproto = new X3DExternProtoDeclaration (this .getExecutionContext ());
							
				this .pushParent (externproto);
				this .ProtoInterface (element); // parse fields
				this .popParent ();

				externproto .setName (name);
				externproto .url_ = this .url;
				externproto .setup ();

				this .getExecutionContext () .externprotos .add (name, externproto);	
			}
		},
		ProtoDeclare: function (element)
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
							this .ProtoInterface (child);
							this .popParent ();
							continue;
						case "ProtoBody":
							this .pushExecutionContext (proto);
							this .ProtoBody (child);
							this .popExecutionContext ();
							continue;
					}
				}

				proto .setName (name);
				proto .setup ();

				this .getExecutionContext () .protos .add (name, proto);
			}
		},
		ProtoInterface: function (element)
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
		ProtoBody: function (element)
		{
			this .statements (element .childNodes);
		},
		IMPORT: function (element)
		{
			try
			{
				var
					inlineNodeName   = element .getAttribute ("inlineDEF"),
					exportedNodeName = element .getAttribute ("exportedDEF"),
					localNodeName    = element .getAttribute ("AS");

				if (inlineNodeName === null)
					throw new Error ("Bad IMPORT statement: Expected exportedDEF attribute.");

				if (exportedNodeName === null)
					throw new Error ("Bad IMPORT statement: Expected exportedDEF attribute.");

				if (! localNodeName)
					localNodeName = exportedNodeName;

				var namedNode = this .getExecutionContext () .getNamedNode (inlineNodeName);

				this .getExecutionContext () .updateImportedNode (namedNode, exportedNodeName, localNodeName);
			}
			catch (error)
			{
				console .warn ("XML Parser Error: " + error .message);
			}
		},
		ROUTE: function (element)
		{
			try
			{
				var
					sourceNodeName      = element .getAttribute ("fromNode"),
					sourceField         = element .getAttribute ("fromField"),
					destinationNodeName = element .getAttribute ("toNode"),
					destinationField    = element .getAttribute ("toField");

				if (sourceNodeName === null)
					throw new Error ("Bad ROUTE statement: Expected fromNode attribute.");

				if (sourceField === null)
					throw new Error ("Bad ROUTE statement: Expected fromField attribute.");

				if (destinationNodeName === null)
					throw new Error ("Bad ROUTE statement: Expected toNode attribute.");

				if (destinationField === null)
					throw new Error ("Bad ROUTE statement: Expected toField attribute.");

				var
					sourceNode      = this .getExecutionContext () .getLocalNode (sourceNodeName),
					destinationNode = this .getExecutionContext () .getLocalNode (destinationNodeName),
					route           = this .getExecutionContext () .addRoute (sourceNode, sourceField, destinationNode, destinationField);

				element .x3d = route;
			}
			catch (error)
			{
				console .warn ("XML Parser Error: " + error .message);
			}
		},
		EXPORT: function (element)
		{
			try
			{
				var
					localNodeName    = element .getAttribute ("localDEF"),
					exportedNodeName = element .getAttribute ("AS");

				if (localNodeName === null)
					throw new Error ("Bad EXPORT statement: Expected localDEF attribute.");

				if (! exportedNodeName)
					exportedNodeName = localNodeName;

				var localNode = this .getExecutionContext () .getLocalNode (localNodeName);

				this .getExecutionContext () .updateExportedNode (exportedNodeName, localNode);
			}
			catch (error)
			{
				console .warn ("XML Parser Error: " + error .message);
			}
		},
		id: function (string)
		{
			if (string === null)
				return false;

			if (string .length === 0)
				return false;

			return true;
		},
		attributeToCamelCase: function (name)
		{
			if (name !== name .toLowerCase())
				return name ;
			
			return HTMLSupport .attributeLowerCaseToCamelCase [name] ;
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

	XMLParser .prototype .fieldTypes [X3DConstants .MFBool]      = Parser .prototype .sfboolValues;
	XMLParser .prototype .fieldTypes [X3DConstants .MFColor]     = Parser .prototype .sfcolorValues;
	XMLParser .prototype .fieldTypes [X3DConstants .MFColorRGBA] = Parser .prototype .sfcolorrgbaValues;
	XMLParser .prototype .fieldTypes [X3DConstants .MFDouble]    = Parser .prototype .sfdoubleValues;
	XMLParser .prototype .fieldTypes [X3DConstants .MFFloat]     = Parser .prototype .sffloatValues;
	XMLParser .prototype .fieldTypes [X3DConstants .MFImage]     = Parser .prototype .sfimageValues;
	XMLParser .prototype .fieldTypes [X3DConstants .MFInt32]     = Parser .prototype .sfint32Values;
	XMLParser .prototype .fieldTypes [X3DConstants .MFMatrix3d]  = Parser .prototype .sfmatrix3dValues;
	XMLParser .prototype .fieldTypes [X3DConstants .MFMatrix3f]  = Parser .prototype .sfmatrix3fValues;
	XMLParser .prototype .fieldTypes [X3DConstants .MFMatrix4d]  = Parser .prototype .sfmatrix4dValues;
	XMLParser .prototype .fieldTypes [X3DConstants .MFMatrix4f]  = Parser .prototype .sfmatrix4fValues;
	XMLParser .prototype .fieldTypes [X3DConstants .MFNode]      = function () { };
	XMLParser .prototype .fieldTypes [X3DConstants .MFRotation]  = Parser .prototype .sfrotationValues;
	XMLParser .prototype .fieldTypes [X3DConstants .MFString]    = Parser .prototype .sfstringValues;
	XMLParser .prototype .fieldTypes [X3DConstants .MFTime]      = Parser .prototype .sftimeValues;
	XMLParser .prototype .fieldTypes [X3DConstants .MFVec2d]     = Parser .prototype .sfvec2dValues;
	XMLParser .prototype .fieldTypes [X3DConstants .MFVec2f]     = Parser .prototype .sfvec2fValues;
	XMLParser .prototype .fieldTypes [X3DConstants .MFVec3d]     = Parser .prototype .sfvec3dValues;
	XMLParser .prototype .fieldTypes [X3DConstants .MFVec3f]     = Parser .prototype .sfvec3fValues;
	XMLParser .prototype .fieldTypes [X3DConstants .MFVec4d]     = Parser .prototype .sfvec4dValues;
	XMLParser .prototype .fieldTypes [X3DConstants .MFVec4f]     = Parser .prototype .sfvec4fValues;

	return XMLParser;
});
